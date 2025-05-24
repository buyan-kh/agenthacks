# Knowde Extension Setup

## API Configuration

To enable AI features (Nodi chat), you need to configure your Claude API key:

### 1. Get a Claude API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Generate an API key

### 2. Configure API Key (Choose ONE method)

#### Method A: Using api-secrets.ts (Recommended for Development)

1. Copy the template file:
   ```bash
   cp src/config/api-secrets.template.ts src/config/api-secrets.ts
   ```
2. Edit `src/config/api-secrets.ts` and replace `your_claude_api_key_here` with your actual API key
3. The file `api-secrets.ts` is gitignored and will not be committed

#### Method B: Direct Configuration (For Testing Only)

1. Edit `src/config/api.ts`
2. Replace `your_claude_api_key_here` with your actual API key
3. **⚠️ WARNING: Do not commit this change to git!**

### 3. Build the Extension

```bash
npm run build
```

### 4. Load in Chrome

1. Open Chrome Extensions (chrome://extensions/)
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

## Security Notes

- **Never commit API keys to version control**
- Use `api-secrets.ts` for local development
- For production deployments, use environment variables
- The `api-secrets.ts` file is automatically gitignored

## Files Structure

```
src/config/
├── api.ts                    # Main API configuration
├── api-secrets.template.ts   # Template for API keys (safe to commit)
└── api-secrets.ts           # Your actual API keys (gitignored)
```
