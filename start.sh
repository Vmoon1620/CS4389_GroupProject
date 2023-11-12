cd client
source npm run build
cd ..
source server/.project_env/Scripts/activate
python3 -m server.src.app

