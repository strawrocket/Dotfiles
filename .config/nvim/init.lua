-- bootstrap lazy.nvim, LazyVim and your plugins
require("config.lazy")
require("plugins.colorscheme")
require("plugins.rainbow")
require("config.formatter")
require("plugins.ui")
require("plugins.editor")

vim.wo.relativenumber = true
vim.opt.spelllang = "en_us"
vim.opt.spell = true
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true
vim.opt.background = "dark"
vim.g.gruvbox_contrast_dark = "hard"
vim.opt.clipboard = "unnamedplus"

require("neo-tree").setup({
  sources = {
    "filesystem",
    "buffers",
    "git_status",
    "document_symbols", -- Ensure this is added
  },
  -- Additional configuration options
})

require("gruvbox").setup({
  overrides = {
    -- Customize LSP method highlight
    -- Customize comment highlight in Lua files
    ["@comment"] = { fg = "#73abc1", bg = "#2e3440" },
    ["@property.c"] = { fg = "#73ab01" },
  },
})

-- Hyprlang LSP
vim.api.nvim_create_autocmd({ "BufEnter", "BufWinEnter" }, {
  pattern = { "*.hl", "hypr*.conf" },
  callback = function(event)
    print(string.format("starting hyprls for %s", vim.inspect(event)))
    vim.lsp.start({
      name = "hyprlang",
      cmd = { "hyprls" },
      root_dir = vim.fn.getcwd(),
    })
  end,
})
