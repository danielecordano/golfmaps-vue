/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCourse = /* GraphQL */ `
  mutation CreateCourse(
    $input: CreateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    createCourse(input: $input, condition: $condition) {
      id
      name
      holes {
        lat
        lng
      }
      owner
      createdAt
      updatedAt
    }
  }
`;
export const updateCourse = /* GraphQL */ `
  mutation UpdateCourse(
    $input: UpdateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    updateCourse(input: $input, condition: $condition) {
      id
      name
      holes {
        lat
        lng
      }
      owner
      createdAt
      updatedAt
    }
  }
`;
export const deleteCourse = /* GraphQL */ `
  mutation DeleteCourse(
    $input: DeleteCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    deleteCourse(input: $input, condition: $condition) {
      id
      name
      holes {
        lat
        lng
      }
      owner
      createdAt
      updatedAt
    }
  }
`;
export const likeCourse = /* GraphQL */ `
  mutation LikeCourse($courseId: ID!) {
    likeCourse(courseId: $courseId)
  }
`;
export const unlikeCourse = /* GraphQL */ `
  mutation UnlikeCourse($courseId: ID!) {
    unlikeCourse(courseId: $courseId)
  }
`;
