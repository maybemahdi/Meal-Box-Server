import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = (this.query?.searchTerm as string) || "";
    this.modelQuery = this.modelQuery.find({
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
    return this;
  }
  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }
  sort() {
    const sort = (this.query?.sort as string) || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 1;
    const skip = (page - 1) * limit || 0;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  async getMetaData() {
    // Clone the query to count documents separately
    const countQuery = this.modelQuery.clone();

    const totalCount = await countQuery.countDocuments(); // Get total count of documents
    const totalPages = Math.ceil(
      totalCount / (Number(this?.query?.limit) || 1),
    );
    const currentPage = Number(this?.query?.page) || 1;

    return {
      totalCount,
      page: currentPage,
      limit: Number(this?.query?.limit) || 1,
      totalPages,
    };
  }
}

export default QueryBuilder;
