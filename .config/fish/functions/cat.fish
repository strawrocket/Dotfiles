function cat
    if type -f bat &>/dev/null
        bat $argv
    else
        command cat $argv
    end
end
