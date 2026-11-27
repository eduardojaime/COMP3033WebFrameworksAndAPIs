import os

import requests
import streamlit as st

# the API location can be changed without editing the code
API_URL = os.getenv("API_URL", "http://localhost:3000/api/v2/projects/")
STATUSES = ["All", "TO DO", "IN PROGRESS", "DONE"]

st.title("Projects")

# credentials are typed by the user and kept in memory only
st.sidebar.header("API credentials")
username = st.sidebar.text_input("Username")
password = st.sidebar.text_input("Password", type="password")

status = st.selectbox("Status", STATUSES)
page = st.number_input("Page", min_value=1, value=1, step=1)

if st.button("Load projects"):
    params = {"page": page}
    if status != "All":
        params["status"] = status

    try:
        # requests builds the Basic Authorization header from the auth tuple
        response = requests.get(
            API_URL, params=params, auth=(username, password), timeout=10
        )
        response.raise_for_status()
    except requests.RequestException as error:
        st.error(f"Could not load projects: {error}")
    else:
        projects = response.json()
        st.caption(f"API version header: {response.headers.get('version', 'not set')}")

        if projects:
            st.dataframe(
                [
                    {
                        "Project": project["name"],
                        "Status": project["status"],
                        "Due date": project["due_date"],
                    }
                    for project in projects
                ],
                hide_index=True,
            )
        else:
            st.info("No projects found.")
