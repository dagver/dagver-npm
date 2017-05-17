declare namespace nodegit {
    class Oid {
        tostrS(): string;
    }
    class Commit {
        id(): Oid;
        parentcount(): number;
        parent(i: number): Promise<Commit>;
    }
    class Repository {
        static discover(startPath: string, acrossFs: number, ceilingDirs: string): Promise<string>;
        static open(path: string): Promise<Repository>;
        getHeadCommit(): Promise<Commit>;
    }
}

declare module "nodegit" {
    export = nodegit;
}