# Security Operations Report

## Updates Since Presentation
1. Added confirmation screen if correct login
2. Updated README.md 
3. Added this file

## Component 1: Software Development 

This project is a fullstack application that utilizes a React.js (Vite Framework) frontend, FastAPI + Python backend, and a DB from PostgreSQL. 

Using FastAPI was needed to accept POST requests from Vite and then interpret them using Python code for the backend. 

I implemented a security measure by only allowing users to upload mp3 files so they can't explicitly upload any malicious scripts.

One improvement I could make to this section is by converting a file to a sha-256 and then uploading the hash to virus total API, would have saved me a lot of headaches and make the app more secure.  

## Component 2: Database Integration 

This application features a PostgreSQL database thats safe against SQL injections by not taking the direct value of the username and password strings like '={username}' to directly input queries, but features some padding. 

Some ways I could improve on this part are by including hashing and encryption in the database through some python libraries to setup the database.

## Component 3: Static and Dynamic Analysis 
I implemented Static Analysis by including an API call to VirusTotal to investigate mp3 files incase there were any malicious extensions or if any of them have related vulnerabilities. 

I implemented dynamic analysis through fuzzing. I tried using vitest but it was frankly a mess, and something I do not know much about to implement. I have used fuzzing in Python, but I flew too close to the sun here by trying it for JS, a language I am not the best at right now. There are still some quirks that need to be worked out with it. 

## Component 4: Memory Mitigation / Protection
I didn't directly implement DEP and ASLR, but I tried it incorporate this concept through other ways. 

Each container has the ability to show and keep logs, so I am able to see what is happening in each and follow the flow of data through them. One thing I need to add is a file for each container to keep an entire catolog of them that appends each time I run them.

I also used the local cache React has, and saved some data related to the color each time it refreshes. This implements user preference but also shows memory discrimination, keeping non-personal information about each user and tailoring the app experience to them while keeping their sensitive stuff safe. 

## Component 5: Enviorment Config
Created a Docker Compose yaml file to keep the db, backend, and frontend containers associated with one another and make it easy to run all three in the same network. 

## Component 6: Documentation
Kept a comprehensive README.md on this project.

## Challenges Faced / Lessons Learned 
Working with CORS was one of the biggest struggles I had here, especially because there were some quirks with requests from a Firefox browser as opposed to a Chrome browser that I had to account for. 

Initially, I had CORS set up like this
```
app.add_middleware(
    CORSMiddleware,
    allow_origins=[*],         
    allow_credentials=True,
    allow_methods=["*"],            
    allow_headers=["*"],            
)
```
But I had to make some changes to allow origins, first by just putting localhost:8080, but after some gemini prompting I got:
```
# NEW CORS INTEGRATION
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*", # MAIN CHANGE
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

I also struggled with fuzzing a lot and had to learn the quirks JS has with it as opposed to python. Still not able to get it for now but something I plan to look for in the future. 

## AI Statement 
I used Gemini, Claude, and very little ChatGPT to help with this assignment, explain concepts, and give boilerplate code to work with and expand on. I am fully responsible for all the code written in this assignment and I reviewed everything. 

## Class Remarks
Had a lot of fun this semester, sorry this final project wasn't as advanced as I hoped it would be, but I gained a lot from the hands on experience. 