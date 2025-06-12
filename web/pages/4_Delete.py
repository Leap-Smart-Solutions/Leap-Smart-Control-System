# web/pages/4_Delete.py
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import streamlit as st
from app.database.db_manager import EmbeddingDatabase

st.title("🗑️ Delete Person from Database")

db = EmbeddingDatabase()
records = db.fetch_all_embeddings()
names = list(set([name for name, _ in records]))

if names:
    selected = st.selectbox("Select person to delete:", names)
    if st.button("Delete"):
        db.delete_by_name(selected)
        st.success(f"Deleted all embeddings for {selected}")
else:
    st.info("No registered faces to delete.")
