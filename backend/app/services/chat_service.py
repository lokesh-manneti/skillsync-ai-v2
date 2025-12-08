from langchain_google_vertexai import ChatVertexAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.core.config import settings

# Same model as before
llm = ChatVertexAI(
    model_name="gemini-2.5-flash",
    temperature=0.7, # Higher temperature for more natural conversation
    max_output_tokens=1024,
    location="us-central1"
)

async def generate_chat_response(user_message: str, profile_context: dict) -> str:
    """
    Generates a response where the AI knows the user's resume and roadmap.
    """
    
    # 1. Prepare Context String
    context_str = f"""
    USER PROFILE CONTEXT:
    - Target Role: {profile_context.get('target_role')}
    - Experience Level: {profile_context.get('experience_level')}
    - Missing Skills: {", ".join(profile_context.get('ai_analysis_json', {}).get('missing_skills', []))}
    - Current Roadmap Phase 1: {profile_context.get('ai_analysis_json', {}).get('roadmap', [{}])[0].get('topics', [])}
    """

    # 2. System Prompt (The Persona)
    system_prompt = f"""You are SkillSync, an expert Career Mentor.
    You have access to the user's career profile and learning roadmap.
    
    {context_str}
    
    Your goal is to answer their questions specifically based on this context. 
    - If they ask about learning resources, recommend specific ones for their missing skills.
    - Be encouraging but realistic.
    - Keep answers concise (under 3 paragraphs).
    """

    # 3. Construct Chain
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("user", "{message}")
    ])
    
    chain = prompt | llm | StrOutputParser()

    # 4. Execute
    response = await chain.ainvoke({"message": user_message})
    return response