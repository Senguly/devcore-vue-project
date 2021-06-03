import gql from "graphql-tag";
import { META_FRAGMENT } from "./meta";
// eslint-disable-next-line
export const MILESTONE_FRAGMENT = gql`
  fragment milestoneFields on Milestone {
    id,
    reward
    title
    requiredScore
    userCount
    description
    users{
      milestoneId
      rewarded
      userId
      engageScore
      user {
          id
          firstName
          lastName
        }
      }
    _metadata {
      ...metaFields
    }
  }
  ${META_FRAGMENT}
`;

export const MILESTONE_FULL_FRAGMENT = gql`
  fragment milestoneFullFields on Milestone {
    ...milestoneFields
  }
  ${MILESTONE_FRAGMENT}
`;

export const MILESTONE = {
  findAll: gql`
    query milestoneFindAll($filter: Filter) {
      milestoneFindAll(filter: $filter) {
        ...milestoneFields
      }
    }
    ${MILESTONE_FRAGMENT}
  `,
  findById: gql`
    query milestoneFindById($id: ID!) {
      milestoneFindById(id: $id) {
        ...milestoneFullFields
      }
    }
    ${MILESTONE_FULL_FRAGMENT}
  `,
  /*   create: gql`
    mutation milestoneCreate($input: MilestoneCreateInput!) {
      milestoneCreate(input: $input) {
        ...milestoneFullFields
      }
    }
    ${MILESTONE_FULL_FRAGMENT}
  `,
  update: gql`
    mutation milestoneUpdate($id: ID!, $input: MilestoneUpdateInput!) {
      milestoneUpdate(id: $id, input: $input) {
        ...milestoneFullFields
      }
    }
    ${MILESTONE_FULL_FRAGMENT}
  `,
  delete: gql`
    mutation milestoneDelete($id: ID!) {
      milestoneDelete(id: $id)
    }
  `, */
  reward: gql`
    mutation milestoneReward($input: MilestoneRewardInput!) {
      milestoneReward(input: $input)
    }
  `
};
