return {
  "saghen/blink.cmp",
  dependencies = {
    "L3MON4D3/LuaSnip",
    "mikavilpas/blink-ripgrep.nvim",
    "Kaiser-Yang/blink-cmp-dictionary",
    {
      "Kaiser-Yang/blink-cmp-git",
      dependencies = { "nvim-lua/plenary.nvim" },
    },
  },
  -- ... Other dependencies
  opts = {
    sources = {
      -- Add 'dictionary' to the list
      -- default = { 'dictionary', 'lsp', 'path', 'luasnip', 'buffer' },
      default = { "lsp", "path", "snippets", "buffer", "dictionary" },
      providers = {
        dictionary = {
          module = "blink-cmp-dictionary",
          name = "Dict",
          score_offset = -3, -- the higher the number, the higher the priority
          enabled = true,
          max_items = 8,
          min_keyword_length = 3,
          --- @module 'blink-cmp-dictionary'
          --- @type blink-cmp-dictionary.Options
          opts = {
            dictionary_files = { vim.fn.expand("~/HES/assets/words.dict") },
            documentation = {
              get_command = "nil",
            },
          },
        },
      },
    },
  },
}
