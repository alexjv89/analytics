"use server";
import { revalidatePath } from "next/cache";
import fs from 'fs'; // Add this import at the top
import { getDB } from "@/database";
import { auth } from "@/auth"
import async from "async";
import nanoid from "@/config/nanoid";
import _ from "lodash";

export async function createOrg(formData) {
  const session = await auth()
  const db = getDB();
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const workflow = {
    createOrg: async () => {
      let org = {
        id: nanoid(),
        name: formData.get("name"),
        description: formData.get("description"),
        details: {
          settings: {},
          feature_flags: {}
        },
        settings: {},
        feature_flags: {
          show_onboarding: true
        }
      };
      let createdOrg = await db.Orgs.create(org);
      return createdOrg;
    },
    createMembership: ["createOrg", async (results) => {
      let membership = {
        user: session?.user?.id,
        org: results.createOrg.id,
        type: 'admin'
      }
      let createdMembership = await db.Members.create(membership);
      return createdMembership;
    }]
  }

  let results = await async.auto(workflow);

  revalidatePath("/orgs", "layout");
  return results;
}