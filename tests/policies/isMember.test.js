import isMember, { hardcodedAuth } from "@/policies/isMember"
import db from "@/database"
import {redirect, notFound} from 'next/navigation';


// Mock the database module
jest.mock("@/database", () => ({
  __esModule: true,
  default: {
    Members: {
      findOne: jest.fn()
    },
    Projects: {
      findOne: jest.fn()
    }
  }
}))

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  notFound: jest.fn()
}))

describe('isMember', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns mock data when no membership found', async () => {
    db.Members.findOne.mockResolvedValue(null) // No membership found
    db.Projects.findOne.mockResolvedValue(null) // No org found

    const result = await isMember({ params: { o_id: 'org123' } })

    expect(result.session).toEqual({
      user: {
        id: 'mock-user-1',
        email: 'test@example.com',
        name: 'Test User'
      }
    })
    expect(result.membership).toEqual({
      id: 'mock-membership-1',
      user: 'mock-user-1',
      org: 'org123',
      role: 'admin'
    })
    expect(result.org).toEqual({
      id: 'org123',
      name: 'Demo Organization',
      currency: 'USD'
    })
  })

  it('returns real data when membership and org exist', async () => {
    const mockMembership = { id: 'mem123', user: 'mock-user-1', org: 'org123' }
    const mockOrg = { id: 'org123', name: 'Test Org' }

    db.Members.findOne.mockResolvedValue(mockMembership)
    db.Projects.findOne.mockResolvedValue(mockOrg)

    const result = await isMember({ params: { o_id: 'org123' } })

    expect(result.session.user.id).toBe('mock-user-1')
    expect(result.org).toEqual(mockOrg)
    expect(result.membership).toEqual(mockMembership)
  })
})