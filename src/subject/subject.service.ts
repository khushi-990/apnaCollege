import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subjects, SubjectsDocument } from './schemas/subject.schema';
import { Model } from 'mongoose';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { TypeExceptions } from 'src/common/helpers/exceptions';
import { RESPONSE_ERROR } from 'src/common/constants/response.constant';
import { DetailsBasedOnIdDto, PaginationDto } from 'src/common/dto/common.dto';
import { CommonService } from 'src/common/services/common.service';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
    constructor(
        @InjectModel(Subjects.name) private subjectModel: Model<SubjectsDocument>,
        private readonly commonService: CommonService,

    ) { }

     /**
     * Creates a new subject.
     * @param createSubjectDto - The data transfer object containing the details of the subject to be created.
     * @throws TypeExceptions.AlreadyExistsCommonFunction if a subject with the same name already exists.
     * @returns The newly created subject document.
     */
    async create(createSubjectDto: CreateSubjectDto) {
        if (await this.getSubjectByName(createSubjectDto.name)) {
            throw TypeExceptions.AlreadyExistsCommonFunction(
                RESPONSE_ERROR.SUBJECT_ALREADY_EXIST,
            );
        }
        return await this.subjectModel.create(createSubjectDto);
    }

    /**
     * This function check based on name if name already exists in our system then throw Error 
     * @param name 
     * @returns 
     */

    async getSubjectByName(name: string) {
        return await this.subjectModel.findOne({ name });
    }

     /**
     * Lists subjects with pagination and optional search functionality.
     * @param body - The pagination and search criteria.
     * @returns An array containing the total count of subjects and the paginated list of subjects.
     */
    async listSubject(body: PaginationDto) {
        const limit = body.limit ? Number(body.limit) : 10;
        const page = body.page ? Number(body.page) : 1;
        const skip = (page - 1) * limit;

        const aggregateQuery = [];

        aggregateQuery.push({
            $project: {
                name: "$name",
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
                subjectList: [{ $skip: skip }, { $limit: limit }],
            },
        });

        const SubjectList = await this.subjectModel
            .aggregate(aggregateQuery)
            .exec();
        if (SubjectList) {
            SubjectList[0].total_records =
                SubjectList[0].total_records.length > 0
                    ? SubjectList[0].total_records[0].count
                    : 0;
        }
        return SubjectList

    }

    async deleteSubject(body: DetailsBasedOnIdDto) {
        return await this.commonService.deleteById(this.subjectModel, body._id, RESPONSE_ERROR.SUBJECT_DELETED);
    }

     /**
     * Finds a subject by its ID.
     * @param _id - The ID of the subject to be found.
     * @returns The subject document if found, otherwise throws an error.
     */
    async findOne(_id: string) {
        return await this.commonService.getDetails(this.subjectModel, _id, RESPONSE_ERROR.SUBJECT_NOT_FOUND)
    }

    /**
     * Updates a subject by its ID.
     * @param subjectId - The ID of the subject to be updated.
     * @param updateSubjectDto - The data transfer object containing the updated subject details.
     * @returns An empty object to indicate successful update.
     */
    async update(subjectId: string, updateSubjectDto: UpdateSubjectDto) {
        await this.subjectModel.findOneAndUpdate(
            { _id: subjectId },
            updateSubjectDto,
        );
        return {}
    }

    async findAllSubject() {
        return await this.subjectModel.find({})
    }
}
