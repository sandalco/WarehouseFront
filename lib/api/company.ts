import api from '../axios'
import { ApiResponse } from "@/types/api-response";
import { Company } from "@/types/company";

/**
 * Get all companies
 */
export async function getCompanies(): Promise<ApiResponse<Company[]>> {
  return await api.get('/company')
}

/**
 * Create a new company
 */
export async function createCompany(companyData: FormData): Promise<ApiResponse<Company>> {
  return await api.post('/company', companyData)
}

/**
 * Update company
 */
export async function updateCompany(id: string, companyData: FormData): Promise<ApiResponse<Company>> {
  return await api.put(`/company/${id}`, companyData)
}

/**
 * Delete company
 */
export async function deleteCompany(id: string): Promise<ApiResponse<void>> {
  return await api.delete(`/company/${id}`)
}

/**
 * Get company by ID
 */
export async function getCompanyById(id: string): Promise<ApiResponse<Company>> {
  return await api.get(`/company/${id}`)
}

// Backward compatibility
export class CompanyAPI {
  static getCompanies = getCompanies
  static createCompany = createCompany
  static updateCompany = updateCompany
  static deleteCompany = deleteCompany
  static getCompanyById = getCompanyById
}

export default CompanyAPI