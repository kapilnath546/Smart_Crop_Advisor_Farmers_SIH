import streamlit as st
import google.generativeai as genai
import os
from dotenv import load_dotenv
from PIL import Image
import io

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv("soil.env")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    st.error("❌ Gemini API key not found. Please set it in soil.env.")
    st.stop()

# -----------------------------
# Configure Gemini API
# -----------------------------
genai.configure(api_key=GEMINI_API_KEY)
# Updated to stable model (as of Sept 2025)
model = genai.GenerativeModel(
    "gemini-2.5-flash",
    safety_settings={
        "HARM_CATEGORY_HARASSMENT": "BLOCK_MEDIUM_AND_ABOVE",
        "HARM_CATEGORY_HATE_SPEECH": "BLOCK_MEDIUM_AND_ABOVE",
    }
)

# -----------------------------
# Detect soil type using Gemini (unified for image or qualitative/params)
# -----------------------------
def detect_soil_type(image_bytes=None, soil_description=None):
    if soil_description is None:
        return None

    try:
        # Base prompt for soil classification
        base_prompt = f"""
        You are an expert agronomist. Classify the soil strictly as one of:
        - Black Soil
        - Red Soil
        - Clay Soil
        - Sandy Soil

        Soil description: {soil_description}
        """

        if image_bytes:
            # For image: Analyze visually, refined by description
            base_prompt = """
            You are an expert agronomist. Analyze the soil image step-by-step:
            1. Describe the color, texture, and any visible particles (e.g., gritty, sticky).
            2. Consider the additional description if provided.
            3. Classify strictly as one of: Black Soil, Red Soil, Clay Soil, Sandy Soil.
            Respond with only the soil type name (e.g., "Black Soil").
            """ + "\n\n" + base_prompt if soil_description else base_prompt
            image = Image.open(io.BytesIO(image_bytes))
            content = [base_prompt, image]
        else:
            # For description only: Infer from qualitative data
            base_prompt += "\n\nBased on this description, respond with only the soil type name."
            content = [base_prompt]

        response = model.generate_content(
            content,
            generation_config={"temperature": 0.1}
        )

        # Parse response more robustly
        soil_type = response.text.strip()
        if soil_type not in ["Black Soil", "Red Soil", "Clay Soil", "Sandy Soil"]:
            soil_type = "Unknown (check inputs)"
        return soil_type

    except Exception as e:
        st.error(f"❌ Error detecting soil: {e}")
        return None

# -----------------------------
# Recommend crops using Gemini
# -----------------------------
def recommend_crops(soil_type, soil_description, manual_params):
    try:
        location = manual_params['location']
        area = manual_params['area']
        prompt = f"""
        You are an expert in agriculture and economics. Based on the following:
        - Soil type: {soil_type}
        - Soil description: {soil_description}
        - Temperature: {manual_params['temp']}°C
        - Humidity: {manual_params['humidity']}%
        - Nitrogen (N): {manual_params['nitrogen']} kg/ha
        - Phosphorus (P): {manual_params['phosphorus']} kg/ha
        - Potassium (K): {manual_params['potassium']} kg/ha
        - Location: {location}
        - Area: {area} acres

        Recommend the top 3 crops that would maximize profit in this location. Consider:
        - Suitability to soil, climate, and nutrient levels.
        - Local market demand, current prices, and yield potential.
        - Estimated profit per acre (in USD, based on average data).
        - Total profit for {area} acres.
        - Reasons for each recommendation.
        - Any risks or tips.

        Format response as:
        1. Crop Name: [Name]
           - Suitability: [Brief]
           - Estimated Yield: [Amount per acre]
           - Market Price: [Price per unit]
           - Profit per Acre: [Estimate USD]
           - Total Profit ({area} acres): [Estimate USD]
           - Reasons: [Details]
        2. ...
        """

        response = model.generate_content(
            prompt,
            generation_config={"temperature": 0.5}  # Allow some creativity for estimates
        )

        return response.text.strip()

    except Exception as e:
        st.error(f"❌ Error recommending crops: {e}")
        return None

# -----------------------------
# Streamlit UI
# -----------------------------
st.set_page_config(page_title="Soil Type Detector & Crop Recommender", layout="centered")
st.markdown("<h1 style='text-align: center; color: darkgreen;'>🌱 Soil Type Detector & Crop Recommender</h1>", unsafe_allow_html=True)
st.markdown("<p style='text-align: center; color: darkblue;'>Upload a soil image or describe your soil to detect type and get profitable crop recommendations.</p>", unsafe_allow_html=True)

col1, col2 = st.columns(2)

# -----------------------------
# Image Upload Column
# -----------------------------
with col1:
    st.subheader("Upload soil image (optional) / ਮਿੱਟੀ ਦੀ ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ (ਵਿਕਲਪਿਕ)")
    image_source = st.file_uploader("Drag and drop file here / ਫਾਈਲ ਇੱਥੇ ਖਿੱਚੋ ਅਤੇ ਛੱਡੋ", type=["jpg", "jpeg", "png"])
    image_bytes = None
    if image_source:
        image_bytes = image_source.read()  # Read once
        image = Image.open(io.BytesIO(image_bytes))
        st.image(image, caption="Uploaded Soil Image / ਅਪਲੋਡ ਕੀਤੀ ਮਿੱਟੀ ਦੀ ਤਸਵੀਰ", use_container_width=True)

# -----------------------------
# Soil Description Column
# -----------------------------
with col2:
    st.subheader("Describe your soil / ਆਪਣੀ ਮਿੱਟੀ ਦਾ ਵਰਣਨ ਕਰੋ")
    st.markdown("**What does the soil feel like in your hand? / ਤੁਹਾਡੇ ਹੱਥ ਵਿੱਚ ਮਿੱਟੀ ਕਿਵੇਂ ਮਹਿਸੂਸ ਹੁੰਦੀ ਹੈ?**")
    texture_options = {
        "🟤 Loose and sandy (falls apart easily) / ਢਿੱਲੀ ਅਤੇ ਰੇਤਲੀ (ਆਸਾਨੀ ਨਾਲ ਟੁੱਟ ਜਾਂਦੀ ਹੈ)": "loose gritty sandy",
        "🟠 Smooth like powder (soft, very fine) / ਪਾਊਡਰ ਵਾਂਗ ਸਾਫ਼ (ਨਰਮ, ਬਹੁਤ ਬਰੀਕ)": "smooth silky fine silt",
        "⚫ Sticky when wet (forms a ball easily) / ਗਿੱਲੀ ਹੋਣ 'ਤੇ ਚਿਪਚਿਪੀ (ਆਸਾਨੀ ਨਾਲ ਗੇਂਦ ਬਣਾਉਂਦੀ ਹੈ)": "sticky plastic clay",
        "⚪ Mix of all (gritty + smooth + sticky) / ਸਾਰੇ ਮਿਲੇ-ਜੁਲੇ (ਰੇਤਲਾ + ਸਾਫ਼ + ਚਿਪਚਿਪਾ)": "mixed loam balanced"
    }
    texture = st.radio("", list(texture_options.keys()), index=0)
    
    st.markdown("**How wet is the soil right now? / ਮਿੱਟੀ ਇਸ ਵੇਲੇ ਕਿੰਨੀ ਗਿੱਲੀ ਹੈ?**")
    moisture_options = {
        "💧 Very wet (waterlogged, shiny) / ਬਹੁਤ ਜ਼ਿਆਦਾ ਗਿੱਲੀ (ਪਾਣੀ ਨਾਲ ਭਰੀ ਹੋਈ, ਚਮਕਦਾਰ)": "very wet waterlogged",
        "🌫 Moist (damp but not dripping) / ਨਮੀ ਵਾਲੀ (ਭਿੱਜੀ ਪਰ ਟਪਕਦੀ ਨਹੀਂ)": "moist damp",
        "🌱 Slightly dry (crumbles but holds shape) / ਥੋੜ੍ਹੀ ਸੁੱਕੀ (ਟੁੱਟਦੀ ਹੈ ਪਰ ਆਕਾਰ ਬਣਾਈ ਰੱਖਦੀ ਹੈ)": "slightly dry friable",
        "🏜 Very dry (completely dusty) / ਬਹੁਤ ਸੁੱਕੀ (ਪੂਰੀ ਤਰ੍ਹਾਂ ਧੂੜ ਵਾਲੀ)": "very dry dusty"
    }
    moisture = st.radio("", list(moisture_options.keys()), index=1)
    
    st.markdown("**What is the color of the soil? / ਮਿੱਟੀ ਦਾ ਰੰਗ ਕੀ ਹੈ?**")
    color_options = {
        "🟤 Dark brown / black (rich color) / ਗੂੜ੍ਹਾ ਭੂਰਾ / ਕਾਲਾ (ਧਨਾਢ ਰੰਗ)": "dark brown black organic rich",
        "🟠 Red or reddish-brown / ਲਾਲ ਜਾਂ ਲਾਲ-ਭੂਰਾ": "red reddish-brown iron oxide",
        "🟡 Yellowish or light brown / ਪੀਲਾ ਜਿਹਾ ਜਾਂ ਹਲਕਾ ਭੂਰਾ": "yellowish light brown leached",
        "⚪ Grayish / whitish / ਧੂਸਰ ਜਾਂ ਚਿੱਟਾ": "grayish whitish poor drainage"
    }
    color = st.radio("", list(color_options.keys()), index=0)
    
    st.markdown("**How hard is it to dig the soil? / ਮਿੱਟੀ ਖੋਦਣ ਵਿੱਚ ਕਿੰਨੀ ਸਖ਼ਤ ਹੈ?**")
    hardness_options = {
        "🪱 Very soft (easy to dig by hand) / ਬਹੁਤ ਨਰਮ (ਹੱਥ ਨਾਲ ਆਸਾਨੀ ਨਾਲ ਖੋਦੀ ਜਾ ਸਕਦੀ ਹੈ)": "very soft loose",
        "🌾 Medium (needs some effort) / ਦਰਮਿਆਨਾ (ਥੋੜ੍ਹੀ ਮਿਹਨਤ ਲੱਗਦੀ ਹੈ)": "medium firm",
        "🧱 Hard (needs tools, dry clods) / ਸਖ਼ਤ (ਉਪਕਰਨਾਂ ਦੀ ਲੋੜ, ਸੁੱਕੇ ਗੱਠੇ)": "hard cloddy compacted",
        "🪨 Very hard / rocky / ਬਹੁਤ ਸਖ਼ਤ / ਪੱਥਰੀਲੀ": "very hard rocky"
    }
    hardness = st.radio("", list(hardness_options.keys()), index=1)
    
    st.markdown("**When you pour water, what happens? / ਜਦੋਂ ਤੁਸੀਂ ਪਾਣੀ ਪਾਉਂਦੇ ਹੋ, ਕੀ ਹੁੰਦਾ ਹੈ?**")
    drainage_options = {
        "💨 Drains very fast (water disappears quickly) / ਬਹੁਤ ਤੇਜ਼ ਨਿਕਾਸ (ਪਾਣੀ ਜਲਦੀ ਗਾਇਬ ਹੋ ਜਾਂਦਾ ਹੈ)": "drains very fast porous",
        "💧 Drains slowly (takes time but no standing water) / ਹੌਲੀ ਨਿਕਾਸ (ਸਮਾਂ ਲੈਂਦਾ ਹੈ ਪਰ ਪਾਣੀ ਖੜਾ ਨਹੀਂ ਹੁੰਦਾ)": "drains slowly moderate",
        "🪣 Stays on top (water forms puddle) / ਉੱਪਰ ਰਹਿੰਦਾ ਹੈ (ਪਾਣੀ ਜਮ ਜਾਂਦਾ ਹੈ)": "stays on top impermeable",
        "🌀 Forms cracks after drying / ਸੁੱਕਣ ਤੋਂ ਬਾਅਦ ਦਰਾਰਾਂ ਬਣਦੀਆਂ ਹਨ": "forms cracks shrink-swell"
    }
    drainage = st.radio("", list(drainage_options.keys()), index=1)

    soil_description = f"Texture: {texture_options[texture]}; Moisture: {moisture_options[moisture]}; Color: {color_options[color]}; Hardness: {hardness_options[hardness]}; Drainage: {drainage_options[drainage]}"

# -----------------------------
# Additional Farm Details
# -----------------------------
st.subheader("Additional farm details / ਹੋਰ ਖੇਤੀਬਾੜੀ ਵੇਰਵੇ")
temp = st.number_input("Temperature (°C) / ਤਾਪਮਾਨ (°C)", value=25.0, min_value=-10.0, max_value=50.0, step=0.1)
humidity = st.number_input("Humidity (%) / ਨਮੀ (%)", value=70.0, min_value=0.0, max_value=100.0, step=0.1)
nitrogen = st.number_input("Nitrogen (N) (kg/ha) / ਨਾਈਟ੍ਰੋਜਨ (N) (ਕਿਲੋਗ੍ਰਾਮ/ਹੈਕਟੇਅਰ)", value=30, min_value=0, step=1)
potassium = st.number_input("Potassium (K) (kg/ha) / ਪੋਟੈਸ਼ੀਅਮ (K) (ਕਿਲੋਗ੍ਰਾਮ/ਹੈਕਟੇਅਰ)", value=30, min_value=0, step=1)
phosphorus = st.number_input("Phosphorus (P) (kg/ha) / ਫਾਸਫੋਰਸ (P) (ਕਿਲੋਗ੍ਰਾਮ/ਹੈਕਟੇਅਰ)", value=10, min_value=0, step=1)
location = st.text_input("Location (e.g., city, country) / ਸਥਾਨ (ਜਿਵੇਂ ਕਿ ਸ਼ਹਿਰ, ਦੇਸ਼)", value="California, USA")
area = st.number_input("Area (acres) / ਖੇਤਰਫਲ (ਏਕੜ)", value=1.0, min_value=0.1, step=0.1)

manual_params = {
    'temp': temp, 'humidity': humidity,
    'nitrogen': nitrogen, 'potassium': potassium, 'phosphorus': phosphorus,
    'location': location, 'area': area
}

# -----------------------------
# Determine soil type
# -----------------------------
detected_soil = None
analysis_method = ""

# Analysis button
run_analysis = st.button("Analyze Soil & Recommend Crops / ਮਿੱਟੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ ਅਤੇ ਫਸਲਾਂ ਦੀ ਸਿਫਾਰਸ਼ ਕਰੋ")
use_desc_for_image = st.checkbox("Refine image analysis with soil description? / ਮਿੱਟੀ ਦੇ ਵਰਣਨ ਨਾਲ ਤਸਵੀਰ ਵਿਸ਼ਲੇਸ਼ਣ ਨੂੰ ਸੁਧਾਰੋ?", value=True) if image_source else False

if run_analysis:
    desc_to_use = soil_description if use_desc_for_image else None
    if image_source:
        analysis_method = "Image / ਤਸਵੀਰ"
    else:
        analysis_method = "Soil description / ਮਿੱਟੀ ਦਾ ਵਰਣਨ"
    
    with st.spinner("Detecting soil type with Gemini... / Gemini ਨਾਲ ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਪਤਾ ਲਗਾਈ ਜਾ ਰਹੀ ਹੈ..."):
        detected_soil = detect_soil_type(image_bytes if image_source else None, desc_to_use)
        if detected_soil:
            analysis_method += " (AI-powered / AI-ਚਲਿਤ)"

# -----------------------------
# Display Soil Results and Crop Recommendations
# -----------------------------
if detected_soil:
    st.success(f"✅ Detected Soil Type: **{detected_soil}** (via {analysis_method}) / ਪਤਾ ਲੱਗੀ ਮਿੱਟੀ ਦੀ ਕਿਸਮ: **{detected_soil}** ({analysis_method} ਰਾਹੀਂ)")
    
    with st.spinner("Recommending profitable crops with Gemini... / Gemini ਨਾਲ ਲਾਭਦਾਇਕ ਫਸਲਾਂ ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ..."):
        crop_recommendations = recommend_crops(detected_soil, soil_description, manual_params)
    
    if crop_recommendations:
        st.markdown("### 🌾 Recommended Crops for Maximum Profit / ਵੱਧ ਤੋਂ ਵੱਧ ਲਾਭ ਲਈ ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਫਸਲਾਂ")
        # Show English first, then Punjabi
        st.markdown("**English:**")
        st.markdown(crop_recommendations)
        st.markdown("---")
        st.markdown("**ਪੰਜਾਬੀ:**")
        # Request Gemini to translate the crop recommendations to Punjabi
        try:
            translation_prompt = f"Translate the following agricultural crop recommendations into Punjabi, preserving formatting and details:\n\n{crop_recommendations}"
            translation_response = model.generate_content(
                translation_prompt,
                generation_config={"temperature": 0.3}
            )
            punjabi_text = translation_response.text.strip()
            st.markdown(punjabi_text)
        except Exception as e:
            st.error(f"❌ Error translating recommendations: {e}")
            st.info("Punjabi translation is currently unavailable.")
    
    st.info("💡 *Note: Estimates are AI-generated based on general data. Check local markets and consult experts for accuracy.* / *ਨੋਟ: ਅੰਦਾਜ਼ੇ ਆਮ ਡੇਟਾ 'ਤੇ ਆਧਾਰਿਤ AI ਦੁਆਰਾ ਬਣਾਏ ਗਏ ਹਨ। ਸਥਾਨਕ ਬਾਜ਼ਾਰਾਂ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਸਹੀ ਜਾਣਕਾਰੀ ਲਈ ਮਾਹਿਰਾਂ ਨਾਲ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਕਰੋ।*")
else:
    st.info("👆 Describe your soil and enter details, then click 'Analyze' to get started! (Image optional.) / 👆 ਆਪਣੀ ਮਿੱਟੀ ਦਾ ਵਰਣਨ ਕਰੋ ਅਤੇ ਵੇਰਵੇ ਭਰੋ, ਫਿਰ 'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ' 'ਤੇ ਕਲਿੱਕ ਕਰੋ! (ਤਸਵੀਰ ਵਿਕਲਪਿਕ ਹੈ।)")
