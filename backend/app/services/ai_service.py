import json
from langchain_google_vertexai import ChatVertexAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from app.core.config import settings

from langchain_core.messages import SystemMessage, HumanMessage # <--- Add this

# UPDATED: Using user-specified model name
llm = ChatVertexAI(
    model_name="gemini-2.5-flash", 
    temperature=0.2,
    max_output_tokens=8192,
    location="us-central1" # Ensure this matches the region where the model is deployed
)

async def generate_career_analysis(resume_text: str, target_role: str, experience_level: str) -> dict:
    # 1. Define the Persona and Instructions
    # We use DOUBLE CURLY BRACES {{ }} for the JSON example so LangChain ignores them.
    system_prompt = """You are an expert Senior Technical Career Coach and AI System Architect.
    Your goal is to analyze a candidate's resume against a specific target role and generate a structured JSON analysis.
    
    You must output STRICT JSON. Do not output markdown code blocks. Just the raw JSON object.
    
    The JSON structure must be:
    {{
        "match_score": <integer 0-100>,
        "executive_summary": "<string: 2 sentence summary of their fit>",
        "skill_breakdown": [
            {{ "category": "Technical Skills", "score": <integer 0-100> }},
            {{ "category": "System Design", "score": <integer 0-100> }},
            {{ "category": "Communication", "score": <integer 0-100> }},
            {{ "category": "Leadership", "score": <integer 0-100> }}
        ],
        "missing_skills": ["<string>", "<string>", ...],
        "roadmap": [
            {{
                "phase": "Phase 1: Foundations",
                "week": "Week 1-2",
                "topics": ["<topic1>", "<topic2>"],
                "action_items": [
                    {{ "task": "<specific task 1>", "completed": false }},
                    {{ "task": "<specific task 2>", "completed": false }}
                ]
            }}
        ]
    }}
    """

    # 2. Define the User Input
    user_prompt = f"""
    CANDIDATE PROFILE:
    Target Role: {target_role}
    Experience Level: {experience_level}
    
    RESUME TEXT:
    {resume_text}
    
    Analyze this now and provide the JSON output.
    """

    # 3. Construct the Chain
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("user", user_prompt)
    ])
    
    chain = prompt | llm | JsonOutputParser()

    # 4. Execute
    try:
        result = await chain.ainvoke({})
        return result
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return {
            "match_score": 0, 
            "executive_summary": f"AI Analysis failed: {str(e)}",
            "missing_skills": [],
            "roadmap": []
        }


# ... existing imports ...

async def generate_optimized_resume(original_text: str, target_role: str, completed_tasks: list[str]) -> str:
    """
    Rewrites the resume to include completed roadmap tasks and optimizes for ATS.
    """
    
    tasks_str = "\n- ".join(completed_tasks) if completed_tasks else "No specific roadmap tasks completed yet."

    # NOTE: We use python f-string (f""") here.
    # 1. We double curly braces {{ }} for LaTeX commands so Python produces literal { }.
    # 2. We use single braces { } for Python variables we want to inject.
    
    system_content = f"""You are an expert LaTeX Resume Developer.
    Your goal is to rewrite a candidate's resume into a high-quality, professional LaTeX document.
    
    INSTRUCTIONS:
    1. Use a standard, clean article class (e.g., \\documentclass{{article}}).
    2. Use \\usepackage{{geometry}} to set 1-inch margins.
    3. Use \\usepackage{{enumitem}} for better lists.
    4. Do NOT use external icon packages like 'fontawesome' unless standard.
    5. Output ONLY the raw LaTeX code starting with \\documentclass and ending with \\end{{document}}.
    6. Integrate these NEW SKILLS into the content:
    {tasks_str}
    
    7. Optimize bullet points for the role: {target_role}.
    """

    user_content = f"""
    ORIGINAL CONTENT:
    {original_text}
    
    GENERATE LATEX CODE NOW.
    """

    # We pass message objects directly. This prevents LangChain from 
    # trying to parse "{article}" as a variable and crashing.
    messages = [
        SystemMessage(content=system_content),
        HumanMessage(content=user_content)
    ]
    
    # Direct chain: Model -> Output Parser (No PromptTemplate)
    chain = llm | StrOutputParser()

    try:
        result = await chain.ainvoke(messages)
        # Cleanup markdown fences if Gemini adds them
        clean_result = result.replace("```latex", "").replace("```", "").strip()
        return clean_result
    except Exception as e:
        return f"% Error generating resume: {str(e)}"