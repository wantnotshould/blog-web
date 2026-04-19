export interface PaginationReq {
  page: number
  per_page: number
}

export interface ListReq extends PaginationReq {}
