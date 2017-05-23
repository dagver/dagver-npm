import "tslib";
import * as Git from "nodegit";

interface Version {
    readonly height: number;
    readonly merge: number;
    readonly local: number;
}

type GetVersion = (commit: Git.Commit) => Promise<Version>;

function createGetVersion(): GetVersion {

    const cache : { [id: string]: Version } = {};
    
    async function getUnknown(commit: Git.Commit): Promise<Version> {
        const n = commit.parentcount();
        if (n === 0) {
            return {
                height: 0,
                merge: 0,
                local: 0,
            };
        } else if (n === 1) {
            const p = await get(await commit.parent(0));
            return {
                height: p.height + 1,
                merge: p.merge,
                local: p.local + 1,
            };
        } else {
            let height = 0;
            let major = 0;
            for (let i = 0; i < n; ++i) {
                const p = await get(await commit.parent(i));
                height = Math.max(height, p.height);
                major = Math.max(major, p.merge);
            }
            return {
                height: height + 1,
                merge: major + 1,
                local: 0
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
        const argv = process.argv;
        const rep = await Git.Repository.open(".");
        const commit = await rep.getHeadCommit();  
        const getVersion = createGetVersion();
        const v = await getVersion(commit);
        const array : string[] = [];
        argv.forEach((arg, i) => {
            if (i >= 2) {
                switch (arg) {
                    case "h":
                        array.push(v.height.toString());
                        break;
                    case "m":
                        array.push(v.merge.toString());
                        break;
                    case "l":
                        array.push(v.local.toString());
                        break;
                    case "c":
                        const id = parseInt(commit.id().tostrS().substr(0, 4), 16);
                        array.push(id.toString());
                        break;
                }
            }
        });
        console.log(array.join("."));
    } catch(e) {
        console.error(e);
    }
}
