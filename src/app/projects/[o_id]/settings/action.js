"use server"
import async from 'async';
import nanoid from '@/config/nanoid';
import { getDB } from '@/database';
import _ from 'lodash';
export async function createApiKey ({orgId,expires_at,name}) {
    const db = getDB();
    const workflow = {
            createAPIKey:async function(){
                var api_key ={
                    name: name,
                    expires_at:(expires_at!='')?expires_at:null,
                    key:'cf_app_'+nanoid(18),
                    secret:nanoid(24),
                    org:orgId
                }
                const res = await db.Api_keys.create(_.cloneDeep(api_key));
                return res?res.toJSON():null;
            }

        }

    const results = await async.auto(workflow)
    return results.createAPIKey

}

export async function deleteApiKey ({id,orgId}){
    const db = getDB();
    const workflow = {
        getAPIKey:async function(){
            var filter ={
                id:id,
                org:orgId?.toString()
            }
            const res = await db.Api_keys.findOne({where:filter});
            if(!res)
                throw new Error('This api_key does not exist');

            return res.toJSON();
        },
        deleteAPIKey:['getAPIKey',async function(){
            var filter ={
                id:id,
                org:orgId?.toString()
            }
            const res = await db.Api_keys.destroy({where:filter});
            return res > 0 ? { message: 'API key deleted successfully', deletedCount: res } : null;
        }]

    }
    try{
        const results = await async.auto(workflow)
        return results.deleteAPIKey
    }catch(err){
        return {message: err.message, error: true}
    }
}