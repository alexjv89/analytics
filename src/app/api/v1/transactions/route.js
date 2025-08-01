import { NextResponse } from "next/server";
import { getDB } from "@/database";
import async from "async";
import { filterTransaction } from "@/utils/server/filter";

export async function GET(request) {
    const apiKey = request.headers.get('api-key');
    const apiSecret = request.headers.get('api-secret');
    if(!apiKey || !apiSecret)
        return NextResponse.json({"status":"Failure","message":"You dont have permission to access this"}, {status: 400})

    const db = getDB();
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams)
    const page = parseInt(query['page']) || 1; 
    const limit = parseInt(query['limit']) || 100;
    const offset = (page - 1) * limit; 
    
    const workflow = {
        getApi_key: async ()=>{
            const api_key = await db.Api_keys.findOne({
                where: {key: apiKey, secret: apiSecret}
            })
            if(api_key && new Date(api_key.expires_at).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
                return {error: true, message: 'Unauthorized: API key expired', statusCode: 401}
            return api_key
        },
        getOrg:['getApi_key', async (results)=>{
            if(!results.getApi_key || results.getApi_key.error)
                return null

            const org = await db.Projects.findOne({
                where: {id: results.getApi_key.org}
            })
            return org
        }],
        getTransactions:['getOrg', async (results)=>{
            if(!results.getOrg)
                return null;
            let where = filterTransaction({org:results.getOrg,searchParams:query});
            
            const transactions = await db.Transactions.findAll({
                attributes: ['id', 'balance', 'account', "inflow", "outflow", "comments", "particulars", "statement", "date","type", "org","entity","category","po"],
                where: where,
                offset: offset, // Skip the calculated offset
                limit: limit, // Limit the number of results returned
                order: [
                    ['date', query.sort_by || 'DESC'],
                    ['created_at', 'DESC']
                ],
                raw: true,
            })

            return transactions
        }],
        populateAccounts:['getOrg','getTransactions', async (results)=>{
            if(!results.getTransactions)
                return null

            const accountIds = results.getTransactions.map(transaction => transaction.account);
            const accounts = await db.Accounts.findAll({
                where: {id: accountIds},
                attributes: ['id', 'name']
            });
            const accountMap = new Map(accounts.map(account => [account.id, account]));
            results.getTransactions.forEach(transaction => {
                const account = accountMap.get(transaction.account);
                transaction.account_id = account.id;
                transaction.account_name = account.name;
                delete transaction.account;

                transaction.balance /=1000
                transaction.inflow /=1000
                transaction.outflow /=1000
            })
        }],
        getTotatCount:['getOrg', async (results)=>{
            if(!results.getOrg)
                return null;
            let where = filterTransaction({org:results.getOrg,searchParams:query});
            const count = await db.Transactions.count({
                where: where
            })
            return count
        }]

    }
    const results = await async.auto(workflow)
    if(results.getApi_key?.error)
        return NextResponse.json({"message": results.getApi_key.message}, {status: results.getApi_key.statusCode ?? 401})
    if(!results.getApi_key || !results.getOrg){
        return NextResponse.json({"message":"Unauthorized: API key not found"}, {status: 401})
    }
    
    let response = {
        transactions: results.getTransactions,
        page_context:{
            count:results.getTransactions.length ,
            page, 
            per_page: limit,
            has_more: results.getTotatCount/limit > page
        }
    }

    return NextResponse.json(response)
}