import "tslib";
import * as Git from "nodegit";

interface Version {
    readonly height: number;
    readonly major: number;
    readonly minor: number;
}

type GetVersion = (commit: Git.Commit) => Promise<Version>;

function createGetVersion(): GetVersion {

    const cache : { [id: string]: Version } = {};
    
    async function getUnknown(commit: Git.Commit): Promise<Version> {
        const n = commit.parentcount();
        if (n == 0) {
            return {
                height: 0,
                major: 0,
                minor: 0,
            };
        } else if (n == 1) {
            const p = await get(await commit.parent(0));
            return {
                height: p.height + 1,
                major: p.major,
                minor: p.minor + 1,
            };
        } else {
            let height = 0;
            let major = 0;
            for (let i = 0; i < n; ++i) {
                const p = await get(await commit.parent(i));
                height = Math.max(height, p.height);
                major = Math.max(major, p.major);
            }
            return {
                height: height + 1,
                major: major + 1,
                minor: 0
            }
        }
    } 
    
    async function get(commit: Git.Commit): Promise<Version> {
        const id = commit.id().tostrS();
        const v = cache[id];
        if (v !== undefined)
        {
            return v;
        }
        const nv = await getUnknown(commit);
        cache[id] = nv;
        return nv;
    };
    
    return get;
}

export async function main()
{
    try {
        const rep = await Git.Repository.open(".");
        const commit = await rep.getHeadCommit();  
        const getVersion = createGetVersion();
        const v = await getVersion(commit);
        console.log(`heght: ${v.height}`);
        console.log(`major: ${v.major}`);
        console.log(`minor: ${v.minor}`);
    } catch(e) {
        console.error(e);
    }
}
