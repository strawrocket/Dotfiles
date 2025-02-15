local Icons = require("beastvim.tweaks").icons
local Picker = require("beastvim.tweaks")

return {
  {
    "folke/which-key.nvim",
    event = "VeryLazy",
    opts = {
      plugins = {
        spelling = { enabled = true },
        presets = { operators = false, motions = false },
      },
      delay = function(ctx)
        return ctx.plugin and 0 or 100
      end,
      win = {
        padding = { 1, 2 }, -- extra window padding [top/bottom, right/left]
        wo = { winblend = 10 },
      },
      layout = {
        height = { min = 3, max = 25 }, -- min and max height of the columns
        width = { min = 20, max = 100 }, -- min and max width of the columns
        spacing = 5, -- spacing between columns
        align = "center", -- align columns left, center or right
      },
      sort = { "order" },
      icons = {
        mappings = true,
        rules = {
          { pattern = "dashboard", icon = "🦁", color = "red" },
          { pattern = "find", icon = " ", color = "cyan" },
          { pattern = "close", icon = "󰅙", color = "red" },
          { pattern = "monokai", icon = "", color = "yellow" },
          { pattern = "explorer", icon = "󱏒", color = "green" },
          { pattern = "format and save", icon = "󱣪", color = "green" },
          { pattern = "save", icon = "󰆓", color = "green" },
          { pattern = "zoom", icon = "", color = "gray" },
          { pattern = "split.*vertical", icon = "󰤼", color = "gray" },
          { pattern = "split.*horizontal", icon = "󰤻", color = "gray" },
          { pattern = "lsp", icon = "󰒋", color = "cyan" },
          { pattern = "ChatGPT", icon = "󰚩", color = "azure" },
          { pattern = "markdown", icon = "", color = "green" },
          { pattern = "diagnostic", icon = "", color = "red" },
          { pattern = "definition", icon = "󰇀", color = "purple" },
          { pattern = "implement", icon = "󰳽", color = "purple" },
          { pattern = "reference", icon = "󰆽", color = "purple" },
          { pattern = "Clipboard", icon = "󰅇", color = "blue" },
          -- Group [<leader>h]
          { pattern = "blame", icon = "", color = "yellow" },
          { pattern = "diff", icon = "", color = "green" },
          { pattern = "hunk change", icon = "", color = "yellow" },
          { pattern = "reset", icon = "", color = "gray" },
          { pattern = "stage", icon = "", color = "green" },
          { pattern = "undo", icon = "", color = "gray" },
          { pattern = "hunk", icon = "󰊢", color = "red" },
          { pattern = "branch", icon = "", color = "red" },
          { pattern = "commit", icon = "", color = "green" },
          -- Group [g]
          { pattern = "word", icon = "", color = "gray" },
          { pattern = "first line", icon = "", color = "gray" },
          { pattern = "comment", icon = "󰅺", color = "cyan" },
          { pattern = "cycle backwards", icon = "󰾹", color = "gray" },
          { pattern = "selection", icon = "󰒉", color = "gray" },
          -- Group [<leader>hn]
          { pattern = "annotation", icon = "󰙆", color = "cyan" },
        },
      },
      defaults = {},
      spec = {
        mode = { "n", "v" },
        { "<leader>g", group = "+Git" },
        { "<leader>s", group = "+Session" },
        { "<leader>a", group = "+AI" },
        { "<leader>c", group = "+Code" },
        { "<leader>l", group = "+LSP" },
        { "<leader>n", group = "+Neogen", icon = { icon = "", color = "cyan" } },
        { "<leader>t", group = "+Toggle" },
        { "<leader>m", group = "+Markdown" },
        { "<leader>d", group = "+Debug" },
        { "<leader>u", group = "UI", icon = { icon = "󰙵 ", color = "cyan" } },
        { "<leader>x", group = "+diagnostics/quickfix", icon = { icon = "󱖫 ", color = "green" } },
        { "<leader><tab>", group = "+Tab", icon = { icon = "󰓩 ", color = "green" } },
        -- { "<leader>n", group = "+Neogen" },
        { "<leader>gc", group = "+Git checkout" },
        -- { "<leader>hn", group = "+Neogen" },
        { "f", group = "+Fold" },
        { "g", group = "+Goto" },
        { "s", group = "+Search" },
      },
      triggers = {
        { "<leader>", mode = { "n", "v" } },
        { "[", group = "prev" },
        { "]", group = "next" },
        { "f", mode = { "n" } }, -- fold group
        { "s", mode = { "n" } }, -- search group
        { "g", mode = { "n", "v" } }, -- search group
      },
    },
    config = function(_, opts)
      local wk = require("which-key")
      wk.setup(opts)
    end,
  },

  {
    "nvim-neo-tree/neo-tree.nvim",
    cmd = "Neotree",
    dependencies = "mrbjarksen/neo-tree-diagnostics.nvim",
    keys = {
      {
        "<leader>e",
        function()
          require("neo-tree.command").execute({ toggle = true, position = "right", dir = Utils.root() })
        end,
        desc = "Explorer (root dir)",
        remap = true,
      },
      {
        "<leader>E",
        function()
          require("neo-tree.command").execute({
            toggle = true,
            position = "float",
            dir = Utils.root(),
          })
        end,
        desc = "Explorer Float (root dir)",
      },
    },
    deactivate = function()
      vim.cmd([[Neotree close]])
    end,
    opts = require("beastvim.features.neo-tree"),
    init = function()
      vim.g.neo_tree_remove_legacy_commands = 1
      if vim.fn.argc() == 1 then
        local stat = vim.uv.fs_stat(vim.fn.argv(0))
        if stat and stat.type == "directory" then
          ---@diagnostic disable-next-line: different-requires
          require("neo-tree")
          vim.cmd([[set showtabline=0]])
        end
      end
    end,
  },

  {
    "lewis6991/gitsigns.nvim",
    ft = { "gitcommit", "diff" },
    event = { "BufReadPre", "BufNewFile" },
    opts = {
      signs = {
        add = { text = Icons.gitsigns.add },
        change = { text = Icons.gitsigns.change },
        delete = { text = Icons.gitsigns.delete },
        topdelhfe = { text = Icons.gitsigns.topdelete },
        changedelete = { text = Icons.gitsigns.changedelete },
        untracked = { text = Icons.gitsigns.untracked },
      },
      current_line_blame = true,
      current_line_blame_opts = {
        delay = 300,
      },
      current_line_blame_formatter = "<author>, <author_time:%Y-%m-%d> - <summary>",
      preview_config = {
        border = Utils.ui.borderchars("thick", "tl-t-tr-r-br-b-bl-l"), -- [ top top top - right - bottom bottom bottom - left ]
      },
      on_attach = function(bufnr)
        local gs = package.loaded.gitsigns
        local map = Utils.safe_keymap_set

        -- Navigation
        map("n", "]c", function()
          if vim.wo.diff then
            return "]c"
          end
          vim.schedule(function()
            gs.next_hunk()
          end)
          return "<Ignore>"
        end, { buffer = bufnr, expr = true, desc = "Next git hunk" })
        map("n", "[c", function()
          if vim.wo.diff then
            return "[c"
          end
          vim.schedule(function()
            gs.prev_hunk()
          end)
          return "<Ignore>"
        end, { buffer = bufnr, expr = true, desc = "Previous git hunk" })

        -- Actions
        map("n", "<leader>gs", gs.stage_hunk, { desc = "Stage current hunk" })
        map("n", "<leader>gr", gs.reset_hunk, { desc = "Reset current hunk" })
        map("v", "<leader>gs", function()
          gs.stage_hunk({ vim.fn.line("."), vim.fn.line("v") })
        end, { desc = "Stage visual selection" })
        map("v", "<leader>gr", function()
          gs.reset_hunk({ vim.fn.line("."), vim.fn.line("v") })
        end, { desc = "Reset visual selection" })
        map("n", "<leader>gS", gs.stage_buffer, { desc = "Stage entire buffer" })
        map("n", "<leader>gu", gs.undo_stage_hunk, { desc = "Undo last hunk staging" })
        map("n", "<leader>gR", gs.reset_buffer, { desc = "Reset entire buffer" })
        map("n", "<leader>gp", gs.preview_hunk, { desc = "Preview current hunk changes" })
        map("n", "<leader>gb", function()
          gs.blame_line({ full = true })
        end, { desc = "Show blame for current line" })
        map("n", "<leader>tb", gs.toggle_current_line_blame, { desc = "Toggle blame for current line" })
        map("n", "<leader>gd", gs.diffthis, { desc = "Diff current hunk" })
        map("n", "<leader>gD", function()
          gs.diffthis("~")
        end, { desc = "Diff all changes in the file" })
      end,
    },
  },

  -- Fold
  {
    "kevinhwang91/nvim-ufo",
    event = { "BufReadPost", "BufNewFile", "BufWritePre" },
    dependencies = { "kevinhwang91/promise-async", event = "BufReadPost" },
    opts = {
      fold_virt_text_handler = function(virtText, lnum, endLnum, width, truncate)
        local newVirtText = {}
        local suffix = ("  … %d "):format(endLnum - lnum)
        local sufWidth = vim.fn.strdisplaywidth(suffix)
        local targetWidth = width - sufWidth
        local curWidth = 0
        for _, chunk in ipairs(virtText) do
          local chunkText = chunk[1]
          local chunkWidth = vim.fn.strdisplaywidth(chunkText)
          if targetWidth > curWidth + chunkWidth then
            table.insert(newVirtText, chunk)
          else
            chunkText = truncate(chunkText, targetWidth - curWidth)
            local hlGroup = chunk[2]
            table.insert(newVirtText, { chunkText, hlGroup })
            chunkWidth = vim.fn.strdisplaywidth(chunkText)
            -- str width returned from truncate() may less than 2nd argument, need padding
            if curWidth + chunkWidth < targetWidth then
              suffix = suffix .. (" "):rep(targetWidth - curWidth - chunkWidth)
            end
            break
          end
          curWidth = curWidth + chunkWidth
        end
        table.insert(newVirtText, { suffix, "MoreMsg" })
        return newVirtText
      end,
      open_fold_hl_timeout = 0,
    },
    keys = {
      { "fd", "zd", desc = "Delete fold under cursor" },
      { "fo", "zo", desc = "Open fold under cursor" },
      { "fO", "zO", desc = "Open all folds under cursor" },
      { "fc", "zC", desc = "Close all folds under cursor" },
      { "fa", "za", desc = "Toggle fold under cursor" },
      { "fA", "zA", desc = "Toggle all folds under cursor" },
      { "fv", "zv", desc = "Show cursor line" },
      {
        "fM",
        function()
          require("ufo").closeAllFolds()
        end,
        desc = "Close all folds",
      },
      {
        "fR",
        function()
          require("ufo").openAllFolds()
        end,
        desc = "Open all folds",
      },
      {
        "fm",
        function()
          require("ufo").closeFoldsWith()
        end,
        desc = "Fold more",
      },
      {
        "fr",
        function()
          require("ufo").openFoldsExceptKinds()
        end,
        desc = "Fold less",
      },
      { "fx", "zx", desc = "Update folds" },
      { "fz", "zz", desc = "Center this line" },
      { "ft", "zt", desc = "Top this line" },
      { "fb", "zb", desc = "Bottom this line" },
      { "fg", "zg", desc = "Add word to spell list" },
      { "fw", "zw", desc = "Mark word as bad/misspelling" },
      { "fe", "ze", desc = "Right this line" },
      { "fE", "zE", desc = "Delete all folds in current buffer" },
      { "fs", "zs", desc = "Left this line" },
      { "fH", "zH", desc = "Half screen to the left" },
      { "fL", "zL", desc = "Half screen to the right" },
    },
  },

  {
    "folke/trouble.nvim",
    cmd = { "Trouble" },
    opts = {
      modes = {
        lsp = {
          win = { position = "right" },
        },
      },
    },
    keys = {
      { "<leader>xx", "<cmd>Trouble diagnostics toggle<cr>", desc = "Diagnostics (Trouble)" },
      { "<leader>xX", "<cmd>Trouble diagnostics toggle filter.buf=0<cr>", desc = "Buffer Diagnostics (Trouble)" },
      { "<leader>xs", "<cmd>Trouble symbols toggle<cr>", desc = "Symbols (Trouble)" },
      { "<leader>cS", "<cmd>Trouble lsp toggle<cr>", desc = "LSP references/definitions/... (Trouble)" },
      { "<leader>xL", "<cmd>Trouble loclist toggle<cr>", desc = "Location List (Trouble)" },
      { "<leader>xQ", "<cmd>Trouble qflist toggle<cr>", desc = "Quickfix List (Trouble)" },
      {
        "[q",
        function()
          if require("trouble").is_open() then
            require("trouble").prev({ skip_groups = true, jump = true })
          else
            local ok, err = pcall(vim.cmd.cprev)
            if not ok then
              vim.notify(err, vim.log.levels.ERROR)
            end
          end
        end,
        desc = "Previous Trouble/Quickfix Item",
      },
      {
        "]q",
        function()
          if require("trouble").is_open() then
            require("trouble").next({ skip_groups = true, jump = true })
          else
            local ok, err = pcall(vim.cmd.cnext)
            if not ok then
              vim.notify(err, vim.log.levels.ERROR)
            end
          end
        end,
        desc = "Next Trouble/Quickfix Item",
      },
    },
  },

  {
    "luukvbaal/statuscol.nvim",
    event = { "VimEnter" }, -- Enter when on Vim startup to setup folding correctly (Avoid number in fold column)
    commit = (function()
      if vim.fn.has("nvim-0.9") == 1 then
        return "483b9a596dfd63d541db1aa51ee6ee9a1441c4cc"
      end
    end)(),
    config = function()
      local builtin = require("statuscol.builtin")
      require("statuscol").setup({
        relculright = false,
        ft_ignore = { "neo-tree" },
        segments = {
          {
            -- line number
            text = { " ", builtin.lnumfunc },
            condition = { true, builtin.not_empty },
            click = "v:lua.ScLa",
          },
          { text = { "%s" }, click = "v:lua.ScSa" }, -- Sign
          { text = { builtin.foldfunc, " " }, click = "v:lua.ScFa" }, -- Fold
        },
      })
      vim.api.nvim_create_autocmd({ "BufEnter" }, {
        callback = function()
          if vim.bo.filetype == "neo-tree" then
            vim.opt_local.statuscolumn = ""
          end
        end,
      })
    end,
  },

  {
    "moll/vim-bbye",
    event = { "BufRead" },
    keys = {
      { "<leader>d", "<cmd>Bdelete!<cr>", desc = "Close Buffer" },
    },
  },
  {
    "gbprod/yanky.nvim",
    recommended = true,
    desc = "Better Yank/Paste",
    opts = {
      highlight = { timer = 150 },
    },
    keys = {
      {
        "<leader>p",
        function()
          require("telescope").extensions.yank_history.yank_history({})
        end,
        mode = { "n", "x" },
        desc = "Open Yank History",
      },
        -- stylua: ignore
      { "y", "<Plug>(YankyYank)", mode = { "n", "x" }, desc = "Yank Text" },
      { "p", "<Plug>(YankyPutAfter)", mode = { "n", "x" }, desc = "Put Text After Cursor" },
      { "P", "<Plug>(YankyPutBefore)", mode = { "n", "x" }, desc = "Put Text Before Cursor" },
      { "gp", "<Plug>(YankyGPutAfter)", mode = { "n", "x" }, desc = "Put Text After Selection" },
      { "gP", "<Plug>(YankyGPutBefore)", mode = { "n", "x" }, desc = "Put Text Before Selection" },
      { "[y", "<Plug>(YankyCycleForward)", desc = "Cycle Forward Through Yank History" },
      { "]y", "<Plug>(YankyCycleBackward)", desc = "Cycle Backward Through Yank History" },
      { "]p", "<Plug>(YankyPutIndentAfterLinewise)", desc = "Put Indented After Cursor (Linewise)" },
      { "[p", "<Plug>(YankyPutIndentBeforeLinewise)", desc = "Put Indented Before Cursor (Linewise)" },
      { "]P", "<Plug>(YankyPutIndentAfterLinewise)", desc = "Put Indented After Cursor (Linewise)" },
      { "[P", "<Plug>(YankyPutIndentBeforeLinewise)", desc = "Put Indented Before Cursor (Linewise)" },
      { ">p", "<Plug>(YankyPutIndentAfterShiftRight)", desc = "Put and Indent Right" },
      { "<p", "<Plug>(YankyPutIndentAfterShiftLeft)", desc = "Put and Indent Left" },
      { ">P", "<Plug>(YankyPutIndentBeforeShiftRight)", desc = "Put Before and Indent Right" },
      { "<P", "<Plug>(YankyPutIndentBeforeShiftLeft)", desc = "Put Before and Indent Left" },
      { "=p", "<Plug>(YankyPutAfterFilter)", desc = "Put After Applying a Filter" },
      { "=P", "<Plug>(YankyPutBeforeFilter)", desc = "Put Before Applying a Filter" },
    },
  },
  {
    "folke/flash.nvim",
    event = "VeryLazy",
    ---@type Flash.Config
    opts = {},
  -- stylua: ignore
  keys = {
    { "s", mode = { "n", "x", "o" }, function() require("flash").jump() end, desc = "Flash" },
    { "S", mode = { "n", "x", "o" }, function() require("flash").treesitter() end, desc = "Flash Treesitter" },
    { "r", mode = "o", function() require("flash").remote() end, desc = "Remote Flash" },
    { "R", mode = { "o", "x" }, function() require("flash").treesitter_search() end, desc = "Treesitter Search" },
    { "<c-s>", mode = { "c" }, function() require("flash").toggle() end, desc = "Toggle Flash Search" },
  },
  },
  {
    "ThePrimeagen/refactoring.nvim",
    event = { "BufReadPre", "BufNewFile" },
    dependencies = {
      "nvim-lua/plenary.nvim",
      "nvim-treesitter/nvim-treesitter",
    },
    keys = {
      { "<leader>r", "", desc = "+refactor", mode = { "n", "v" } },
      {
        "<leader>rs",
        pick,
        mode = "v",
        desc = "Refactor",
      },
      {
        "<leader>ri",
        function()
          require("refactoring").refactor("Inline Variable")
        end,
        mode = { "n", "v" },
        desc = "Inline Variable",
      },
      {
        "<leader>rb",
        function()
          require("refactoring").refactor("Extract Block")
        end,
        desc = "Extract Block",
      },
      {
        "<leader>rf",
        function()
          require("refactoring").refactor("Extract Block To File")
        end,
        desc = "Extract Block To File",
      },
      {
        "<leader>rP",
        function()
          require("refactoring").debug.printf({ below = false })
        end,
        desc = "Debug Print",
      },
      {
        "<leader>rp",
        function()
          require("refactoring").debug.print_var({ normal = true })
        end,
        desc = "Debug Print Variable",
      },
      {
        "<leader>rc",
        function()
          require("refactoring").debug.cleanup({})
        end,
        desc = "Debug Cleanup",
      },
      {
        "<leader>rf",
        function()
          require("refactoring").refactor("Extract Function")
        end,
        mode = "v",
        desc = "Extract Function",
      },
      {
        "<leader>rF",
        function()
          require("refactoring").refactor("Extract Function To File")
        end,
        mode = "v",
        desc = "Extract Function To File",
      },
      {
        "<leader>rx",
        function()
          require("refactoring").refactor("Extract Variable")
        end,
        mode = "v",
        desc = "Extract Variable",
      },
      {
        "<leader>rp",
        function()
          require("refactoring").debug.print_var()
        end,
        mode = "v",
        desc = "Debug Print Variable",
      },
    },
    opts = {
      prompt_func_return_type = {
        go = false,
        python = true,
        java = false,
        cpp = false,
        c = false,
        h = false,
        hpp = false,
        cxx = false,
      },
      prompt_func_param_type = {
        go = false,
        python = true,
        java = false,
        cpp = false,
        c = false,
        h = false,
        hpp = false,
        cxx = false,
      },
      printf_statements = {},
      print_var_statements = {},
      show_success_message = true, -- shows a message with information about the refactor on success
      -- i.e. [Refactor] Inlined 3 variable occurrences
    },
    config = function(_, opts)
      require("refactoring").setup(opts)
      if Utils.has_feature("telescope.nvim") then
        LazyVim.on_load("telescope.nvim", function()
          require("telescope").load_extension("refactoring")
        end)
      end
    end,
  },
}
