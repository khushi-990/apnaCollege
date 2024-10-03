import { Injectable } from "@nestjs/common";
import mongoose, { Model } from "mongoose";
import { TypeExceptions } from "../helpers/exceptions";

@Injectable()
export class CommonService {
  constructor() {}

  /**
   * The function `getDetails` retrieves details of a specific model entity by its ID and throws a
   * custom exception if the entity is not found.
   * @param model - The `model` parameter in the `getDetails` function is expected to be an instance of
   * a Mongoose model. It is used to query the database for details based on the provided `id`.
   * @param {string} id - The `id` parameter in the `getDetails` function represents the unique
   * identifier of the document you want to retrieve from the database.
   */
  async getDetails<T>(model: Model<T>, id: string, notFoundMessage: string ): Promise<T> {
    const details = await model.findOne({ _id: new mongoose.Types.ObjectId(id)});
    
    if (!details) {
      throw TypeExceptions.NotFoundCommonFunction(notFoundMessage); // Use the dynamic message
    }
    return details;
  }

  /**
   * The function `deleteById` deletes a document by its ID from a given model and returns the deleted
   * document, throwing an error with a custom message if the document is not found.
   * @param model - The `model` parameter is the Mongoose model representing a specific collection in
   * the database. It is used to perform operations like finding and deleting documents in that
   * collection.
   * @param {string} id - The `id` parameter in the `deleteById` function represents the unique
   * identifier of the document you want to delete from the database.
   */
  async deleteById<T>(model: Model<T>, id: string, notFoundMessage: string): Promise<T> {
    const deletedDocument = await model.findOneAndDelete({ _id: id });

    if (!deletedDocument) {
        throw TypeExceptions.NotFoundCommonFunction(notFoundMessage); // Use the dynamic message
    }

    return deletedDocument;
}

}
