#!/bin/sh
set -e

timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
new_version=$1;
commit_tail="travis[bot]: autopublish ${timestamp}"
author_email='github-actions[bot][travis]@users.noreply.github.com';
author_name='github-actions[bot][travis]';
commit_message="##$new_version - $commit_tail"
target_branch=${INPUT_BRANCH:-master}
remote_repo="https://${GITHUB_ACTOR}:${INPUT_GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

echo "Push to branch $target_branch the new version";
[ -z "${INPUT_GITHUB_TOKEN}" ] && {
    echo 'Missing input "github_token: ${{ secrets.GITHUB_TOKEN }}".';
    exit 1;
};

git config http.sslVerify false
git config --local user.email "${author_email}"
git config --local user.name "${author_name}"

git add -A

git commit -m "{$commit_message}" || exit 0

git tag "$new_version"

git push "${remote_repo}" HEAD:"${target_branch}" --tags;