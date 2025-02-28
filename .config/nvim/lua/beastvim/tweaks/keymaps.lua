local map = Utils.safe_keymap_set
local telescope = require("telescope.builtin")

local function sleep(n)
  os.execute("sleep " .. tonumber(n))
end

-- Function to run the selected file in a tmux pane
local function run_in_tmux(file_path)
  if not file_path or file_path == "" then
    print("No file selected")
    return
  end

  local file_dir = vim.fn.fnamemodify(file_path, ":h") -- Extract the file's directory
  local command = "python " .. vim.fn.shellescape(file_path) -- Python execution command

  -- Check if running inside a tmux session
  local tmux_pane = os.getenv("TMUX")
  if not tmux_pane then
    print("Not inside a TMUX session")
    return
  end

  -- Get the original Neovim pane ID
  local handle = io.popen("tmux display-message -p '#{pane_id}'")
  local original_pane = handle and handle:read("*l") or nil
  if handle then
    handle:close()
  end

  -- Get the number of panes in the current tmux window
  local pane_count_handle = io.popen("tmux list-panes | wc -l")
  local pane_count = pane_count_handle and pane_count_handle:read("*n") or 1
  if pane_count_handle then
    pane_count_handle:close()
  end

  -- If only one pane exists, create a new one in the same directory
  if pane_count == 1 then
    os.execute(string.format("tmux split-window -v -c %s", vim.fn.shellescape(file_dir)))
    sleep(0.5) -- Short delay for tmux pane to open
  end

  -- Ensure there's another pane before switching
  if pane_count > 1 then
    os.execute("tmux select-pane -D") -- Move to the bottom pane
  end

  -- Send the Python command to the Tmux pane
  os.execute(string.format("tmux send-keys %s Enter", vim.fn.shellescape(command)))

  -- Return focus back to Neovim after sending the command
  if original_pane then
    sleep(0.1) -- Short delay before switching back
    os.execute(string.format("tmux select-pane -t %s", vim.fn.shellescape(original_pane)))
  end
end

-- Function that opens Telescope and runs the selected file in tmux
local function run_file_from_telescope()
  telescope.find_files({
    prompt_title = "Select a file to run in Tmux",
    cwd = vim.fn.expand("%:p:h"), -- Open in current file's directory
    attach_mappings = function(_, map)
      map("i", "<CR>", function(prompt_bufnr)
        local selection = require("telescope.actions.state").get_selected_entry()
        require("telescope.actions").close(prompt_bufnr)
        if selection and selection.path then
          run_in_tmux(selection.path)
        else
          print("No file selected")
        end
      end)
      return true
    end,
  })
end

-------------------- General Mappings --------------------------
map("n", "<leader>w", "<cmd>w!<CR>", { desc = "Save" })
map("n", "<leader>q", "<cmd>q!<CR>", { desc = "Quit" })
map("n", "<leader>Q", "<cmd>qa!<CR>", { desc = "Quit all" })
map({ "i", "x", "n", "s" }, "<C-s>", "<cmd>w<cr><esc>", { desc = "Save File" })

-------------------- Better window navigation ------------------
map("n", "<C-h>", "<C-w>h", { desc = "Go to left window", remap = true })
map("n", "<C-j>", "<C-w>j", { desc = "Go to lower window", remap = true })
map("n", "<C-k>", "<C-w>k", { desc = "Go to upper window", remap = true })
map("n", "<C-l>", "<C-w>l", { desc = "Go to right window", remap = true })

-------------------- Better tab navigation ------------------
-- Taken from lazyvim
map("n", "<leader><tab>l", "<cmd>tablast<cr>", { desc = "Last Tab" })
map("n", "<leader><tab>o", "<cmd>tabonly<cr>", { desc = "Close Other Tabs" })
map("n", "<leader><tab>f", "<cmd>tabfirst<cr>", { desc = "First Tab" })
map("n", "<leader><tab><tab>", "<cmd>tabnew<cr>", { desc = "New Tab" })
map("n", "<leader><tab>]", "<cmd>tabnext<cr>", { desc = "Next Tab" })
map("n", "<leader><tab>d", "<cmd>tabclose<cr>", { desc = "Close Tab" })
map("n", "<leader><tab>[", "<cmd>tabprevious<cr>", { desc = "Previous Tab" })

-------------------- Better tab navigation ------------------
map("n", "<Tab>", ":tabnext<cr>", { desc = "Tab-Left" })
map("n", "<S-Tab>", ":tabprev<cr>", { desc = "Tab-Right" })

-------------------- Press jk fast to enter --------------------
map("i", "jk", "<ESC>", { desc = "Escape from insert mode" })
map("i", "Jk", "<ESC>", { desc = "Escape from insert mode" })
map("i", "jK", "<ESC>", { desc = "Escape from insert mode" })
-- map("i", "JK", "<ESC>", { desc = "Escape from insert mode" })

-------------------- Stay in indent mode ------------------------
map("v", "<", "<gv", { desc = "Indent left" })
map("v", ">", ">gv", { desc = "Indent right" })
map("v", "p", '"_dP')

map("n", "<leader>rr", function()
  run_in_tmux(vim.fn.expand("%:p"))
end, { noremap = true, silent = true, desc = "Run Python in TMUX" })
map("n", "<leader>rR", run_file_from_telescope, { noremap = true, silent = true, desc = "Run Python in TMUX" })

-------------------- Resize windows ----------------------------
map("n", "<C-Up>", "<cmd>resize +2<cr>", { desc = "Increase window height" })
map("n", "<C-Down>", "<cmd>resize -2<cr>", { desc = "Decrease window height" })
map("n", "<C-Left>", "<cmd>vertical resize -2<cr>", { desc = "Decrease window width" })
map("n", "<C-Right>", "<cmd>vertical resize +2<cr>", { desc = "Increase window width" })

-------------------- Move text up/ down ------------------------
-- Normal --
map("n", "<A-S-j>", "<cmd>m .+1<cr>==", { desc = "Move down" })
map("n", "<A-S-k>", "<cmd>m .-2<cr>==", { desc = "Move up" })
-- Block --
map("x", "<A-S-j>", ":move '>+1<CR>gv-gv", { desc = "Move down" })
map("x", "<A-S-k>", ":move '<-2<CR>gv-gv", { desc = "Move up" })
-- Insert --
map("i", "<A-S-j>", "<esc><cmd>m .+1<cr>==gi", { desc = "Move down" })
map("i", "<A-S-k>", "<esc><cmd>m .-2<cr>==gi", { desc = "Move up" })
-- Visual --
map("v", "<A-S-j>", ":m '>+1<cr>gv=gv", { desc = "Move down" })
map("v", "<A-S-k>", ":m '<-2<cr>gv=gv", { desc = "Move up" })

-------------------- No highlight ------------------------------
map("n", ";", ":noh<CR>", { desc = "Clear search" })

-------------------- Inspect --------------------------------
map("n", "<F2>", "<cmd>Inspect<CR>", { desc = "Inspect highlight fallback" })

-------------------- split window ------------------------------
map("n", "<leader>\\", ":vsplit<CR>", { desc = "Split window vertically" })
map("n", "<leader>-", ":split<CR>", { desc = "Split window horizontally" })

-------------------- Switch two windows ------------------------
map("n", "<A-o>", "<C-w>r", { desc = "Rotate window" })

----------------- HACK: Toggle pin scrolloff -------------------
map("n", "<leader>to", function()
  vim.opt.scrolloff = 999 - vim.o.scrolloff
end, { desc = "Toggle pin scrolloff" })

------------------- Select all --------------------------------
map("n", "<C-a>", "gg<S-v>G", { desc = "Select all" })

map({ "n", "i", "v" }, "<C-U>", "<C-Y><C-Y><C-Y><C-Y><C-Y><C-Y><C-Y><C-Y><C-Y><C-Y><C-Y><C-Y><C-Y><C-Y><C-Y><C-Y>")
map({ "n", "i", "v" }, "<C-D>", "<C-E><C-E><C-E><C-E><C-E><C-E><C-E><C-E><C-E><C-E><C-E><C-E><C-E><C-E><C-E><C-E>")

------------------ Fuzzy Search --------------------------------
vim.keymap.set("n", "<C-f>", function()
  -- You can pass additional configuration to telescope to change theme, layout, etc.
  require("telescope.builtin").current_buffer_fuzzy_find(require("telescope.themes"))
end, { desc = "[/] Fuzzily search in current buffer]" })
