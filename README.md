# dagver

Versioning for Git Commit DAG (Directed acyclic graph)

## Installation

```
npm install -g dagver
```

## Usage

```
dagver
```

## Output Example

```
height: 27
major: 6
minor: 14
```

Where

- `height` is a Git height
- `major` is a merge height, a maximum number of merges in a Git graph path.
- `minor` is a number of commits from the last merge.