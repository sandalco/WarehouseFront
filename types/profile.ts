export interface ProfileUser {
  id: string
  roles: string[]
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  companyId: string
  warehouseId: string
}

export interface ProfileCompany {
  companyName: string
  warehouseName: string
  subscription: string
}

export interface ProfileData {
  user: ProfileUser
  company: ProfileCompany
}

export interface ProfileResponse {
  data: ProfileData
  isSuccess: boolean
  statusCode: number
  errors: string[] | null
}
