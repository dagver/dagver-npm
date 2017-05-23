# dagver

Versioning for Git Commit DAG (Directed acyclic graph)

## Installation

```
npm install -g dagver
```

## Usage

Options:

```
h - a commit height, a number of commits in the longest Git graph path
m - a merge height, a maximum number of merges in a Git graph path
l - a number of commits from the last merge
c - a commit number, the first 4 hex digits converted to decimal number
```

## Output Examples

```
>dagver h c
3245.11114
```

```
>dagver m l c
1379.20.11114
```