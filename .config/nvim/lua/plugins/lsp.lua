return {
  -- tools
  {
    "williamboman/mason.nvim",
    opts = function(_, opts)
      vim.list_extend(opts.ensure_installed, {
        "stylua",
        "luacheck",
        "clangd",
      })
    end,
  },

  -- lsp servers
  -- {
  --   "neovim/nvim-lspconfig",
  --   opts = {
  --     ---@type lspconfig.Config
  --     servers = {
  --       clangd = {
  --         cmd = { "clangd", "-clang-tidy", "--enable-config" },
  --         root_dir = function(...)
  --           return require("lspconfig.util").root_pattern(".git")(...)
  --         end,
  --         settings = {
  --           clangd = {
  --             inlayHints = {
  --               enable = true,
  --               unusedvariable = true,
  --             },
  --             diagnostics = {
  --               enable = true,
  --               showInlayHints = true,
  --               severity = {
  --                 warning = true,
  --               },
  --             },
  --           },
  --         },
  --       },
  --     },
  --     setup = {},
  --   },
  -- },
  {
    "neovim/nvim-lspconfig",
    opts = function()
      local keys = require("lazyvim.plugins.lsp.keymaps").get()
      vim.list_extend(keys, {
        {
          "gd",
          function()
            -- DO NOT RESUSE WINDOW
            require("telescope.builtin").lsp_definitions({ reuse_win = false })
          end,
          desc = "Goto Definition",
          has = "definition",
        },
      })
    end,
  },
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        pyright = {
          settings = {
            python = {
              pythonPath = "/home/abeer/anaconda3/bin/python", -- Replace with your Conda Python path
              analysis = {
                typeCheckingMode = "basic", -- Optional: Enables type checking
                autoSearchPaths = true, -- Autoload dependencies
                useLibraryCodeForTypes = true, -- Use library introspection for autocompletion
              },
              venvPath = "/home/abeer/miniforge3/envs/sklearn-env", -- Set the virtual environment path
              venv = "sklearn-env", -- Set the virtual environment name
            },
          },
        },
      },
    },
  },
}
