export interface Company {
  id: string
  name: string
  warehouses: number
  subscription: string
}

export interface CreateCompanyRequest {
  name: string
  description: string
  logoUrl: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface CompanyResponse {
  data: Company[]
  isSuccess: boolean
  statusCode: number
  errors: string[] | null
}

export interface CreateCompanyResponse {
  data: Company
  isSuccess: boolean
  statusCode: number
  errors: string[] | null
}
