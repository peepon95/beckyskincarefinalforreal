# OpenRouter API Key Issue

## Problem
Your current OpenRouter API key is **invalid or expired**. The API returns:
```
{"error":{"message":"User not found.","code":401}}
```

## Solution

### Option 1: Get a New Free API Key (Recommended)
1. Go to https://openrouter.ai/
2. Sign up or log in
3. Go to https://openrouter.ai/keys
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-...`)
6. Open your `.env` file
7. Replace the value of `EXPO_PUBLIC_OPENROUTER_API_KEY` with your new key
8. Restart the server

### Option 2: Work on Bolt First
If you want to test the API key on Bolt first:
1. Add the same API key to Bolt's environment
2. Test the skin analysis there
3. Once it works, use the same key here

## Current Key Location
File: `/Users/eevontan/Desktop/Becky Skincare App/beckyskincarefinalforreal/beckyskincarefinalforreal/.env`
Line: `EXPO_PUBLIC_OPENROUTER_API_KEY=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`

## After Updating
1. Save the `.env` file
2. Restart the server (I can do this for you)
3. Try the skin analysis again
