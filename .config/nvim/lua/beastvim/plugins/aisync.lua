--[[
  Unleash seamless collaboration between AI and coding
  Effortlessly boost efficiency with plugins that adapt to your needs,
  creating a streamlined and innovative development experience.
                                        -- Aisync --
]]

return {
  -- Copilot
  {
    "zbirenbaum/copilot.lua",
    cmd = "Copilot",
    event = { "InsertEnter" },
    build = ":Copilot auth",
    dependencies = { "zbirenbaum/copilot-cmp" },
    opts = {
      suggestion = { enabled = true },
      panel = { enabled = true },
      filetypes = {
        ["*"] = true, -- disable for all other filetypes and ignore default `filetypes`
      },
    },
  },
  {
    "zbirenbaum/copilot.lua",
    cmd = "Copilot",
    event = { "InsertEnter" },
    build = ":Copilot auth",
    dependencies = { "zbirenbaum/copilot-cmp" },
    opts = {
      suggestion = { enabled = true },
      panel = { enabled = true },
      filetypes = {
        ["*"] = true, -- disable for all other filetypes and ignore default `filetypes`
      },
    },
  },
  {
    "zbirenbaum/copilot-cmp",
    event = { "InsertEnter" },
    dependencies = { "copilot.lua" },
    opts = {},
    config = function(_, opts)
      local copilot_cmp = require("copilot_cmp")
      copilot_cmp.setup(opts)
      Utils.lsp.on_attach(function(client, _)
        if client.name == "copilot" then
          copilot_cmp._on_insert_enter()
        end
      end)
    end,
  },

  -- Codeium
  {
    "Exafunction/codeium.nvim",
    cmd = "Codeium",
    event = "InsertEnter",
    build = ":Codeium Auth",
    opts = {
      enable_cmp_source = vim.g.ai_cmp,
      virtual_text = {
        enabled = vim.g.ai_cmp,
        key_bindings = {
          accept = true, -- handled by nvim-cmp / blink.cmp
          next = "<M-]>",
          prev = "<M-[>",
        },
      },
    },
  },

  {
    "huggingface/llm.nvim",
    -- event = { "InsertEnter", "CmdlineEnter" },
    lazy = true,
    opts = function()
      local job = require("plenary.job")
      local logger = require("plenary.log").new({
        plugin = "llm.nvim",
        level = "info",
      })

      local splitCommandIntoTable = function(command)
        local cmd = {}
        for word in command:gmatch("%S+") do
          table.insert(cmd, word)
        end
        return cmd
      end

      local function loadConfigFromCommand(command, callback, defaultValue)
        local cmd = splitCommandIntoTable(command)
        job
          :new({
            command = cmd[1],
            args = vim.list_slice(cmd, 2, #cmd),
            on_exit = function(j, exit_code)
              if exit_code ~= 0 then
                logger.warn("Command'" .. command .. "' did not return a value when executed")
                return
              end
              local value = j:result()[1]:gsub("%s+$", "")
              if value ~= nil and value ~= "" then
                callback(value)
              elseif defaultValue ~= nil and defaultValue ~= "" then
                callback(defaultValue)
              end
            end,
          })
          :start()
      end

      local huggingface_api_token
      local command = "pass show huggingface/access-token"
      loadConfigFromCommand(command, function(value)
        huggingface_api_token = value
      end, "")

      return {
        api_token = huggingface_api_token,
        model = "bigcode/starcoder", -- can be a model ID or an http(s) endpoint
        accept_keymap = "<Tab>",
        dismiss_keymap = "<S-Tab>",
        query_params = {
          max_new_tokens = 60,
          temperature = 0.3,
          top_p = 0.95,
          stop_tokens = nil,
        },
        enable_suggestions_on_files = "*.py,*.lua,*.java,*.js,*.jsx,*.ts,*.tsx,*.html,*.css,*.scss,*.json,*.yaml,*.yml,*.md,*.rmd,*.tex,*.bib,*.cpp,*.h,*.hpp", -- pattern matching syntax to enable suggestions on specific files, either a string or a list of strings
      }
    end,
  },

  {
    "jackMort/ChatGPT.nvim",
    dependencies = {
      "MunifTanjim/nui.nvim",
      "nvim-lua/plenary.nvim",
      "nvim-telescope/telescope.nvim",
      "folke/trouble.nvim", -- Optional dependency
    },
    cmd = { "ChatGPTActAs", "ChatGPT" },
    opts = {
      api_key_cmd = "secret-tool lookup openai neovim",
      openai_edit_params = {
        -- model = "gpt-4-1106-preview",
        model = "gpt-3.5-turbo",
        frequency_penalty = 0,
        presence_penalty = 0,
        temperature = 0.9,
        top_p = 1,
        n = 1,
      },
    },
    keys = {
      { "<leader>ac", "<cmd>ChatGPT<CR>", desc = "ChatGPT" },
      { "<leader>ae", "<cmd>ChatGPTEditWithInstruction<CR>", desc = "Edit with instruction", mode = { "n", "v" } },
      { "<leader>ag", "<cmd>ChatGPTRun grammar_correction<CR>", desc = "Grammar Correction", mode = { "n", "v" } },
      { "<leader>at", "<cmd>ChatGPTRun translate<CR>", desc = "Translate", mode = { "n", "v" } },
      { "<leader>ak", "<cmd>ChatGPTRun keywords<CR>", desc = "Keywords", mode = { "n", "v" } },
      { "<leader>ad", "<cmd>ChatGPTRun docstring<CR>", desc = "Docstring", mode = { "n", "v" } },
      { "<leader>aa", "<cmd>ChatGPTRun add_tests<CR>", desc = "Add Tests", mode = { "n", "v" } },
      { "<leader>ao", "<cmd>ChatGPTRun optimize_code<CR>", desc = "Optimize Code", mode = { "n", "v" } },
      { "<leader>as", "<cmd>ChatGPTRun summarize<CR>", desc = "Summarize", mode = { "n", "v" } },
      { "<leader>af", "<cmd>ChatGPTRun fix_bugs<CR>", desc = "Fix Bugs", mode = { "n", "v" } },
      { "<leader>ax", "<cmd>ChatGPTRun explain_code<CR>", desc = "Explain Code", mode = { "n", "v" } },
      { "<leader>ar", "<cmd>ChatGPTRun roxygen_edit<CR>", desc = "Roxygen Edit", mode = { "n", "v" } },
      {
        "<leader>al",
        "<cmd>ahatGPTRun code_readability_analysis<CR>",
        desc = "Code Readability Analysis",
        mode = { "n", "v" },
      },
    },
  },
}
