import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapters, ChaptersDocument } from './schemas/chapter.schema';
import mongoose, { Model } from 'mongoose';
import { CommonService } from 'src/common/services/common.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { DetailsBasedOnIdDto, PaginationDto } from 'src/common/dto/common.dto';
import { RESPONSE_ERROR } from 'src/common/constants/response.constant';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Injectable()
export class ChapterService {
    constructor(
        @InjectModel(Chapters.name) private chapterModel: Model<ChaptersDocument>,
        private readonly commonService: CommonService,
    ) { }

    /**
     * This function is used for craete chapter
     * @param createChapterDto 
     * @returns 
     */
    async create(createChapterDto: CreateChapterDto) {
        return await this.chapterModel.create(createChapterDto);
    }

    /**
     * This function use for fetch all chapter
     * @param body 
     * @param id 
     * @returns 
     */

    async listChapter(body: PaginationDto, id?: string) {
        const limit = body.limit ? Number(body.limit) : 10;
        const page = body.page ? Number(body.page) : 1;
        const skip = (page - 1) * limit;

        const aggregateQuery = [];

        if(id){
            aggregateQuery.push({
                $match: {
                    topicId: new mongoose.Types.ObjectId(id)
                }
            })
        }

        aggregateQuery.push({
            $lookup: {
                from: 'table_topic',
                localField: 'topicId',
                foreignField: '_id',
                as: 'topicDetails',
            },
        });

        aggregateQuery.push({
            $unwind: {
                path: '$topicDetails',
                preserveNullAndEmptyArrays: true,
            },
        });

        aggregateQuery.push({
            $project: {
                name: "$name",
                topicName: "$topicDetails.name",
                isActive: "$isActive",
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
                            name: {
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

        const ChapterList = await this.chapterModel
            .aggregate(aggregateQuery)
            .exec();
        if (ChapterList) {
            ChapterList[0].total_records =
                ChapterList[0].total_records.length > 0
                    ? ChapterList[0].total_records[0].count
                    : 0;
        }
        return ChapterList
    }

    /**
     * This function is used for delete chapter
     * @param body 
     * @returns 
     */

    async deleteChapter(body: DetailsBasedOnIdDto) {
        return await this.commonService.deleteById(this.chapterModel, body._id, RESPONSE_ERROR.CHAPTER_DELETED);
    }

    /**
     * This function used for based on id fetach particullur id based deatils
     * @param _id 
     * @returns 
     */

    async findOne(_id: string) {
        return await this.commonService.getDetails(this.chapterModel, _id, RESPONSE_ERROR.CHAPTER_NOT_FOUND)
    }

    /**
     * This function is used for update basic chapter info NOTE: not updated ref value like subjectId and topicId
     * @param chapterId 
     * @param updateChapterDto 
     * @returns 
     */

    async update(chapterId: string, updateChapterDto: UpdateChapterDto) {
        await this.chapterModel.findOneAndUpdate(
            { _id: chapterId },
            updateChapterDto,
        );
        return {}
    }

    /**
     * 
     * @param _id This api use for list all chpter
     * @returns 
     */

    async findAllChapter() {
        return await this.chapterModel.find()
    }

}
