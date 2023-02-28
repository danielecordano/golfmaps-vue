/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCourse = /* GraphQL */ `
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
      id
      name
      holes {
        lat
        lng
      }
      likes
      owner
      createdAt
      updatedAt
    }
  }
`;
export const listCourses = /* GraphQL */ `
  query ListCourses(
    $filter: ModelCourseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchCourses = /* GraphQL */ `
  query SearchCourses(
    $filter: SearchableCourseFilterInput
    $sort: SearchableCourseSortInput
    $limit: Int
    $nextToken: String
    $from: Int
  ) {
    searchCourses(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
    ) {
      items {
        id
        name
        owner
        createdAt
        updatedAt
      }
      nextToken
      total
    }
  }
`;
