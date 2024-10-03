import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Promblems, PromblemsDocument } from './schemas/problem.schema';
import mongoose, { Model } from 'mongoose';
import { CommonService } from 'src/common/services/common.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { DetailsBasedOnIdDto, PaginationDto } from 'src/common/dto/common.dto';
import { LevelEnum } from './enum/Level.enum';
import { RESPONSE_ERROR } from 'src/common/constants/response.constant';
import { TypeExceptions } from 'src/common/helpers/exceptions';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { ProblemListAllDto, ProblemPaginationDto } from 'src/student/dto/student.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProblemService {
    constructor(
        @InjectModel(Promblems.name) private problemModel: Model<PromblemsDocument>,
        private readonly commonService: CommonService,
        private readonly usersService: UsersService,
    ) { }


    /**
     * This function is used for create problem
     * @param createProblemDto 
     * @returns 
     */

    async create(createProblemDto: CreateProblemDto) {
        const level = LevelEnum[createProblemDto.level]
        return await this.problemModel.create({ ...createProblemDto, level });
    }


    /**
     * This function is used for fetch all problem here we apply pagination /search and sort functionality
     * @param body 
     * @returns 
     */
    async listProblem(body: PaginationDto) {
        const limit = body.limit ? Number(body.limit) : 10;
        const page = body.page ? Number(body.page) : 1;
        const skip = (page - 1) * limit;

        const aggregateQuery = [];

        aggregateQuery.push({
            $lookup: {
                from: 'table_chapter',
                as: 'chpterDetails',
                let: { currentChapterId: '$chapterId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$$currentChapterId', '$_id'] } } },
                    {
                        $lookup: {
                            from: 'table_topic',
                            as: 'topicDetails',
                            let: { currentTopicId: '$topicId' },
                            pipeline: [
                                { $match: { $expr: { $eq: ['$$currentTopicId', '$_id'] } } },
                                { $project: { _id: 1, name: 1, description: 1, subjectId: 1 } },
                            ],
                        },
                    },
                    {
                        $unwind: {
                            path: '$topicDetails',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            description: 1,
                            topicId: 1,
                            topicDetails: 1,
                        },
                    },
                ],
            },
        });
        aggregateQuery.push({
            $unwind: {
                path: '$chpterDetails',
                preserveNullAndEmptyArrays: true,
            },
        });


        aggregateQuery.push({
            $project: {
                title: "$title",
                chapterId: "$chapterId",
                description: "$description",
                level: "$level",
                leetcodeorCodeforceLink: "$leetcodeorCodeforceLink",
                youtubeLink: "$youtubeLink",
                articleLink: "$articleLink",
                chapterName: "$chpterDetails.name",
                chapterDescription: "$chpterDetails.description",
                topicName: "$chpterDetails.topicDetails.name",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            },
        });

        if (body.search) {
            const searchText = body.search;
            const regex = new RegExp(searchText, "i"); // Use the search term directly in the regex
            aggregateQuery.push({
                $match: {
                    $or: [
                        {
                            title: {
                                $regex: regex,
                            },
                        },
                        {
                            topicName: {
                                $regex: regex,
                            },
                        },
                    ],
                },
            });
        }

        const sortDir = body.sort_order && body.sort_order.includes('asc') ? 1 : -1;

        /// sorting
        aggregateQuery.push({
            $sort: { [body.sort_by ? `${body.sort_by}` : 'createdAt']: sortDir },
        });

        aggregateQuery.push({
            $facet: {
                total_records: [{ $count: "count" }],
                topicList: [{ $skip: skip }, { $limit: limit }],
            },
        });

        const ProblemList = await this.problemModel
            .aggregate(aggregateQuery)
            .exec();
        if (ProblemList) {
            ProblemList[0].total_records =
                ProblemList[0].total_records.length > 0
                    ? ProblemList[0].total_records[0].count
                    : 0;
        }
        return ProblemList
    }

    /**
     * This function is used for deleteproblem
     * @param body 
     * @returns 
     */

    async deleteProblem(body: DetailsBasedOnIdDto) {
        return await this.commonService.deleteById(this.problemModel, body._id, RESPONSE_ERROR.CHAPTER_DELETED);
    }

    /**
     * This function is used for find based on id deatils
     * @param _id 
     * @returns 
     */

    async findOne(_id: string) {
        const problem = await this.problemModel
            .findById(_id)
            .exec();

        if (!problem) {
            throw TypeExceptions.NotFoundCommonFunction(RESPONSE_ERROR.PROBLEM_NOT_FOUND); // Use the dynamic message 
        }

        return {
            success: true,
            data: problem,
        };
    }

    /**
     * This function is used for update progem NOTE: Don't update value which have refernce craete like chapterId,topicId..
     * @param problemId 
     * @param updateProblemDto 
     * @returns 
     */

    async update(problemId: string, updateProblemDto: UpdateProblemDto) {
        await this.problemModel.findOneAndUpdate(
            { _id: problemId },
            updateProblemDto,
        );
        return {}
    }

    /**
     * This function is call when user click on chapter and based on chapter how many problem arrive list show purpose
     * @param body 
     * @param loginUserId 
     * @returns 
     */

    async listOfProblemBasedOnChapter(body: ProblemPaginationDto, loginUserId: string) {
        const limit = body.limit ? Number(body.limit) : 10;
        const page = body.page ? Number(body.page) : 1;
        const skip = (page - 1) * limit;

        const aggregateQuery = [];

        if (body.chapterId) {
            aggregateQuery.push({
                $match: {
                    chapterId: new mongoose.Types.ObjectId(body.chapterId),
                },
            });
        }

        aggregateQuery.push({
            $lookup: {
                from: 'table_chapter',
                as: 'chpterDetails',
                let: { currentChapterId: '$chapterId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$$currentChapterId', '$_id'] } } },
                    {
                        $lookup: {
                            from: 'table_topic',
                            as: 'topicDetails',
                            let: { currentTopicId: '$topicId' },
                            pipeline: [
                                { $match: { $expr: { $eq: ['$$currentTopicId', '$_id'] } } },
                                { $project: { _id: 1, name: 1, description: 1, subjectId: 1 } },
                            ],
                        },
                    },
                    {
                        $unwind: {
                            path: '$topicDetails',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            description: 1,
                            topicId: 1,
                            topicDetails: 1,
                        },
                    },
                ],
            },
        });

        aggregateQuery.push({
            $unwind: {
                path: '$chpterDetails',
                preserveNullAndEmptyArrays: true,
            },
        });

        // Add the login user's completedProblems data
        const user = await this.usersService.findOneSelectedField(loginUserId)
        console.log("🚀 ~ ProblemService ~ listOfProblemBasedOnChapter ~ user:", user)
        const completedProblems = user ? user.completedProblems : [];

        aggregateQuery.push({
            $addFields: {
                completed: {
                    $in: ['$_id', completedProblems], // Check if the problem's _id is in the user's completedProblems array
                },
            },
        });

        aggregateQuery.push({
            $project: {
                title: "$title",
                chapterId: "$chapterId",
                description: "$description",
                level: "$level",
                leetcodeorCodeforceLink: "$leetcodeorCodeforceLink",
                youtubeLink: "$youtubeLink",
                articleLink: "$articleLink",
                chapterName: "$chpterDetails.name",
                chapterDescription: "$chpterDetails.description",
                topicName: "$chpterDetails.topicDetails.name",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
                completed: 1, // Include the completed field in the final response
            },
        });

        if (body.search) {
            const searchText = body.search;
            const regex = new RegExp(searchText, "i"); // Use the search term directly in the regex
            aggregateQuery.push({
                $match: {
                    $or: [
                        {
                            title: {
                                $regex: regex,
                            },
                        },
                        {
                            topicName: {
                                $regex: regex,
                            },
                        },
                    ],
                },
            });
        }

        const sortDir = body.sort_order && body.sort_order.includes('asc') ? 1 : -1;

        /// sorting
        aggregateQuery.push({
            $sort: { [body.sort_by ? `${body.sort_by}` : 'createdAt']: sortDir },
        });

        aggregateQuery.push({
            $facet: {
                total_records: [{ $count: "count" }],
                topicList: [{ $skip: skip }, { $limit: limit }],
            },
        });

        const ProblemList = await this.problemModel.aggregate(aggregateQuery).exec();

        if (ProblemList) {
            ProblemList[0].total_records =
                ProblemList[0].total_records.length > 0
                    ? ProblemList[0].total_records[0].count
                    : 0;
        }

        return ProblemList;
    }

    /**
     * This function is used when user show all problem in problem section here is apply filter diff cartiria based
     * @param body 
     * @param loginUserId 
     * @returns 
     */
    async listAllStudentProblem(body: ProblemListAllDto, loginUserId: string) {
        const limit = body.limit ? Number(body.limit) : 10;
        const page = body.page ? Number(body.page) : 1;
        const skip = (page - 1) * limit;

        const aggregateQuery = [];



        // Apply chapterId filter early
        if (body.chapterId) {
            const chapterIds = body.chapterId.map(id => new mongoose.Types.ObjectId(id));
            aggregateQuery.push({
                $match: {
                    chapterId: {
                        $in: chapterIds // Use $in to match any of the chapterId values
                    }
                }
            });
        }

        // Optimize lookup for chapter and topic
        aggregateQuery.push({
            $lookup: {
                from: 'table_chapter',
                let: { chapterId: '$chapterId' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$chapterId'] }
                        }
                    },
                    {
                        $lookup: {
                            from: 'table_topic',
                            let: { topicId: '$topicId' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ['$_id', '$$topicId'] }
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'table_subject',
                                        let: { subjectId: '$subjectId' },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: { $eq: ['$_id', '$$subjectId'] }
                                                }
                                            },
                                            {
                                                $project: {
                                                    _id: 1,
                                                    name: 1,
                                                }
                                            }
                                        ],
                                        as: 'subjectDetails'
                                    }
                                },
                                { $unwind: { path: '$subjectDetails', preserveNullAndEmptyArrays: true } },
                                { $project: { _id: 1, name: 1, subjectId: 1, subjectName: '$subjectDetails.name' } }
                            ],
                            as: 'topicDetails'
                        }
                    },
                    { $unwind: { path: '$topicDetails', preserveNullAndEmptyArrays: true } },
                    { $project: { _id: 1, name: 1, topicId: 1, topicName: '$topicDetails.name', subjectName: '$topicDetails.subjectName', subjectId: "$topicDetails.subjectId" } }
                ],
                as: 'chapterDetails'
            }
        });

        aggregateQuery.push({
            $unwind: { path: '$chapterDetails', preserveNullAndEmptyArrays: true }
        });

        // Apply topicId and subjectId filters early
        if (body.topicId && Array.isArray(body.topicId)) {
            const topicIds = body.topicId.map(id => new mongoose.Types.ObjectId(id));

            aggregateQuery.push({
                $match: {
                    'chapterDetails.topicId': {
                        $in: topicIds // Use $in to match any of the topicId values
                    }
                }
            });
        }

        if (body.subjectId && Array.isArray(body.subjectId)) {
            const subjectIds = body.subjectId.map(id => new mongoose.Types.ObjectId(id));

            aggregateQuery.push({
                $match: {
                    'chapterDetails.subjectId': {
                        $in: subjectIds // Use $in to match any of the subjectId values
                    }
                }
            });
        }

        // Apply level filter early
        if (body.level && Array.isArray(body.level)) {
            const levels = body.level.map(level => LevelEnum[level]); // Map levels to their enum values

            aggregateQuery.push({
                $match: {
                    level: {
                        $in: levels // Use $in to match any of the level values
                    }
                }
            });
        }

        // Optimize completed check: lookup and apply only if necessary
        if (loginUserId) {
            aggregateQuery.push({
                $lookup: {
                    from: 'table_user',
                    let: { problemId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', new mongoose.Types.ObjectId(loginUserId)] },
                                        { $in: ['$$problemId', '$completedProblems'] }
                                    ]
                                }
                            }
                        },
                        { $project: { completed: { $literal: true } } }
                    ],
                    as: 'completedDetails'
                }
            });
            aggregateQuery.push({
                $addFields: {
                    completed: { $ifNull: [{ $arrayElemAt: ['$completedDetails.completed', 0] }, false] }
                }
            });
        } else {
            aggregateQuery.push({
                $addFields: { completed: false }
            });
        }

        // Selective projection for performance
        aggregateQuery.push({
            $project: {
                title: 1,
                chapterId: 1,
                description: 1,
                level: 1,
                leetcodeorCodeforceLink: 1,
                youtubeLink: 1,
                articleLink: 1,
                chapterName: '$chapterDetails.name',
                topicName: '$chapterDetails.topicDetails.name',
                topicId: '$chapterDetails.topicDetails._id',
                subjectName: '$chapterDetails.topicDetails.subjectDetails.name',
                createdAt: 1,
                updatedAt: 1,
                completed: 1
            }
        });

        // Apply search optimization with indexes
        if (body.search) {
            const searchRegex = new RegExp(body.search, 'i');
            aggregateQuery.push({
                $match: {
                    $or: [
                        { title: { $regex: searchRegex } },
                        { 'chapterDetails.topicDetails.name': { $regex: searchRegex } },
                        { 'chapterDetails.topicDetails.subjectDetails.name': { $regex: searchRegex } }
                    ]
                }
            });
        }

        // Sort optimization (ensure sorting field has an index in MongoDB)
        const sortDirection = body.sort_order && body.sort_order.includes('asc') ? 1 : -1;
        aggregateQuery.push({
            $sort: { [body.sort_by || 'createdAt']: sortDirection }
        });

        // Pagination
        aggregateQuery.push({
            $facet: {
                total_records: [{ $count: 'count' }],
                problemList: [{ $skip: skip }, { $limit: limit }]
            }
        });

        const problemList = await this.problemModel.aggregate(aggregateQuery).exec();

        // Ensure total records count is available
        if (problemList && problemList.length) {
            problemList[0].total_records = problemList[0].total_records.length > 0
                ? problemList[0].total_records[0].count
                : 0;
        }

        return problemList;
    }


}
