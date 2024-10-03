import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Topics, TopicsDocument } from './schemas/topic.schema';
import mongoose, { Model } from 'mongoose';
import { CommonService } from 'src/common/services/common.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { DetailsBasedOnIdDto, PaginationDto } from 'src/common/dto/common.dto';
import { RESPONSE_ERROR } from 'src/common/constants/response.constant';
import { UpdateTopicDto } from './dto/update-topic.dto';

/**
 * Service for managing topics.
 */
@Injectable()
export class TopicService {
    constructor(
        @InjectModel(Topics.name) private topicModel: Model<TopicsDocument>,
        private readonly commonService: CommonService,
    ) { }

    /**
     * Creates a new topic.
     * 
     * @param createTopicDto - The data transfer object containing the details of the topic to be created.
     * @returns The newly created topic document.
     */
    async create(createTopicDto: CreateTopicDto) {
        return await this.topicModel.create(createTopicDto);
    }

    /**
     * Lists topics with pagination, optional filtering by topic ID, and search functionality.
     * 
     * @param body - The pagination and search criteria.
     * @param id - An optional ID to filter topics.
     * @returns An array containing the total count of topics and the paginated list of topics.
     */
    async listTopic(body: PaginationDto, id?: string) {
        const limit = body.limit ? Number(body.limit) : 10; // Default limit to 10 if not specified.
        const page = body.page ? Number(body.page) : 1; // Default page to 1 if not specified.
        const skip = (page - 1) * limit; // Calculate the number of documents to skip.

        const aggregateQuery = [];

        // If an ID is provided, filter the topics by the given ID.
        if (id) {
            aggregateQuery.push({
                $match: {
                    topicId: new mongoose.Types.ObjectId(id)
                }
            });
        }

        // Perform a lookup to join topic data with subject details from the 'table_subject' collection.
        aggregateQuery.push({
            $lookup: {
                from: 'table_subject',
                localField: 'subjectId', // Field from the topics collection.
                foreignField: '_id', // Field from the subjects collection to match.
                as: 'subjectDetails', // Output array field name.
            },
        });

        // Unwind the subject details to deconstruct the array into separate documents.
        aggregateQuery.push({
            $unwind: {
                path: '$subjectDetails',
                preserveNullAndEmptyArrays: true, // Keep topics without subject details.
            },
        });

        // Project the desired fields from the topics and subject details.
        aggregateQuery.push({
            $project: {
                name: "$name",
                subjectName: "$subjectDetails.name", // Get the subject name from the joined data.
                isActive: "$isActive",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            },
        });

        // If a search term is provided, create a regex to match topic and subject names.
        if (body.search) {
            const searchText = body.search;
            const regex = new RegExp(searchText, "i"); // Create a case-insensitive regex.
            aggregateQuery.push({
                $match: {
                    $or: [
                        {
                            name: {
                                $regex: regex, // Match topic names that contain the search term.
                            },
                        },
                        {
                            subjectName: {
                                $regex: regex, // Match subject names that contain the search term.
                            },
                        },
                    ],
                },
            });
        }

        // Determine the sort direction based on the provided parameters.
        const sortDir = body.sort_order && body.sort_order.includes('asc') ? 1 : -1;

        // Sort the results by the specified field or by 'createdAt' by default.
        aggregateQuery.push({
            $sort: { [body.sort_by ? `${body.sort_by}` : 'createdAt']: sortDir },
        });

        // Use $facet to get both the total count of topics and the paginated topic list.
        aggregateQuery.push({
            $facet: {
                total_records: [{ $count: "count" }],
                topicList: [{ $skip: skip }, { $limit: limit }],
            },
        });

        // Execute the aggregation query.
        const TopicList = await this.topicModel
            .aggregate(aggregateQuery)
            .exec();

        // Ensure the total records count is included in the response.
        if (TopicList) {
            TopicList[0].total_records =
                TopicList[0].total_records.length > 0
                    ? TopicList[0].total_records[0].count
                    : 0;
        }
        return TopicList; // Return the results.
    }

    /**
     * Deletes a topic by its ID.
     * 
     * @param body - Contains the ID of the topic to be deleted.
     * @returns The result of the delete operation.
     */
    async deleteTopic(body: DetailsBasedOnIdDto) {
        // Call the common delete function to remove the topic by ID.
        return await this.commonService.deleteById(this.topicModel, body._id, RESPONSE_ERROR.SUBJECT_DELETED);
    }

    /**
     * Finds a topic by its ID.
     * 
     * @param _id - The ID of the topic to be found.
     * @returns The topic document if found, otherwise throws an error.
     */
    async findOne(_id: string) {
        // Retrieve the topic details using the common service method.
        return await this.commonService.getDetails(this.topicModel, _id, RESPONSE_ERROR.TOPIC_NOT_FOUND);
    }

    /**
     * Updates a topic by its ID.
     * 
     * @param topicId - The ID of the topic to be updated.
     * @param updateTopicDto - The data transfer object containing the updated topic details.
     * @returns An empty object to indicate successful update.
     */
    async update(topicId: string, updateTopicDto: UpdateTopicDto) {
        // Find the topic by ID and update it with the new details.
        await this.topicModel.findOneAndUpdate(
            { _id: topicId },
            updateTopicDto,
        );
        return {}; // Return an empty object to indicate success.
    }
    /**
     * This function is used for find all topic
     * @param _id 
     * @returns 
     */

    async findAllTopic() {
        return await this.topicModel.find()
    }
}
