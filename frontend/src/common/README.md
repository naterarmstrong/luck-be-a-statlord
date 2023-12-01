# Reason for `common` inside `frontend/src`

The common folder is located within the frontend `src/`, because the frontend react project has problems with files being located outside of `src`, even if they are symlinked in. The babel loader has problems with that. Because the backend is able to import things from this folder, I am using this folder to hold code that is shared between the front and backend.
