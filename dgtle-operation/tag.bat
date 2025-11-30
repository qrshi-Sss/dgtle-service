@echo off
set /p version=input version:
@echo on
node ./scripts/version.cjs %version%
git commit -am "%version%"
git tag v%version%
@echo off
set /p push=push right now?(y or n):
if "%push%"=="y" (
  @echo on
  git push
  git push --tags
)

