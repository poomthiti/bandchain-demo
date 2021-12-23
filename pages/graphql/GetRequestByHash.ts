import { gql } from '@apollo/client'

export const GET_REQUEST_BY_HASH = gql`
  query GET_REQUEST_BY_HASH($tx_hash:bytea!) {
    requests(where: {transaction: {hash: {_eq: $tx_hash}}}) {
      result
    }
  }
`