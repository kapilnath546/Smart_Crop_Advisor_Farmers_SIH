import streamlit as st
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv("pest.env")
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    st.error("❌ API key not found. Please check your pest.env file.")
    st.stop()

# Configure Gemini API
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

# Page Config
st.set_page_config(page_title="🌱 AI Pest Detection", page_icon="🌾", layout="centered")

# --- Custom CSS ---
st.markdown("""
<style>
/* Remove Streamlit default header */
header.stAppHeader {display: none;}

/* App background */
.stApp {
    background: #1b5e20 !important;
    font-family: 'Arial', sans-serif;
}

/* Top bar */
.top-bar {
    background: white;
    color: black;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    text-align: center;
}
.top-bar h1 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: bold;
}
.top-bar p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
}
</style>
""", unsafe_allow_html=True)

# --- Top Bar ---
st.markdown("""
<div class="top-bar">
    <h1>🌱 AI Pest Detection</h1>
    <p>Upload or capture a crop image. Get pest/disease detection in <b>English & Punjabi</b>.</p>
</div>
""", unsafe_allow_html=True)

# Upload Options
uploaded_file = st.file_uploader("🖼️ Upload from Gallery", type=["jpg", "jpeg", "png"])
camera_file = st.camera_input("📷 Take Photo")
image_source = uploaded_file if uploaded_file else camera_file

# Process Image
if image_source:
    st.image(image_source, caption="Selected Image", use_container_width=True)
    img_bytes = image_source.read()

    with st.spinner("🔍 Analysing image..."):
        try:
            response = model.generate_content(
                [
                    "You are an expert in agriculture. Detect the pest or disease in this crop image. "
                    "Explain in English: what pest/disease it is, how it happens, why it occurs, and what precautions farmers should take. "
                    "Then also explain the same in Punjabi language.",
                    {"mime_type": "image/jpeg", "data": img_bytes},
                ]
            )

            # Show result box
            st.markdown(f"""
            <div style='background-color: #e8f5e9; padding: 20px; border-radius: 10px; margin-top: 20px'>
                <h2 style='color: black;'>✅ Analysis Complete</h2>
                <div style='color:#1b5e20; font-size:16px; white-space: pre-wrap;'>{response.text}</div>
            </div>
            """, unsafe_allow_html=True)

            # Download Button
            st.download_button(
                label="📄 Download Report",
                data=response.text,
                file_name="pest_report.txt",
                mime="text/plain",
            )

        except Exception as e:
            st.error(f"❌ Something went wrong: {e}")
