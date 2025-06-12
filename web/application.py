import streamlit as st
from streamlit_option_menu import option_menu
import os

# 📌 لازم يكون أول أمر
st.set_page_config(page_title="Face Recognition", layout="wide")

# مسار اللوجو بشكل ديناميكي (يشتغل من أي مكان)
BASE_PATH = os.path.dirname(__file__)
LOGO_PATH = os.path.join(BASE_PATH, "assets", "logo.jpg")  # ← غيّر لـ png لو لازم

# ✅ عرض اللوجو أعلى الـ sidebar
with st.sidebar:
    st.image(LOGO_PATH, width=200)
    st.markdown("---")  # فاصل جمالي

    choice = option_menu(
        "Navigation",
        ["Register", "Recognize", "Live Camera", "Delete"],
        icons=["person-plus", "search", "camera", "trash"],
        menu_icon="cast",
        default_index=0,
        orientation="vertical",
    )

# ✅ التوجيه للصفحات
if choice == "Register":
    st.switch_page("pages/1_Register.py")
elif choice == "Recognize":
    st.switch_page("pages/2_Recognize.py")
elif choice == "Live Camera":
    st.switch_page("pages/3_Live_Camera.py")
elif choice == "Delete":
    st.switch_page("pages/4_Delete.py")
