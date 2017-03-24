
function Get-AuthToken
{
    Param(
        # UserId help description
        [Parameter(Mandatory = $true,
....
        "lastLoginTime" = 0
        "commands" = @(
            [PSCustomObject]@{
                "action" = "auth.getAuthToken"
                "args" = [PSCustomObject]@{
                    "playerId" = $UserId
                    "requestToken" = $request_token
                }
                "requestId" = 2
                "time" = 0
                "token" = [guid]::NewGuid()
}


function Connect-Player
{
    Param ($player_id, $auth_token)

    $batch = [PSCustomObject]@{
        "authKey" = "$auth_token"

        "commands" = @(
            [PSCustomObject]@{
                "action" = "player.login"
                "args" = [PSCustomObject]@{
                    "playerId" = "$($player_id)"
            }
        )
    }
...
}


function Get-Player
{
    Param ($player_id)

    $auth_token = Get-AuthToken

    $batch = [PSCustomObject]@{
        "authKey" = "$auth_token"
        "commands" = @(
            [PSCustomObject]@{
                "action" = "player.neighbor.visit"
                "args" = [PSCustomObject]@{
                    "playerId" = "$((Get-PlayerPref).prefPlayerId)"
                    "neighborId" = "$($player_id)"
                }
                "time" = [int](Get-EpochTime)
            }
        )
    }
.....

    Write-Output $result
}


function Get-Squad
{
    Param ($AuthToken, $PlayerID, $SquadID, $LoginTime)

    $batch = [PSCustomObject]@{
        "authKey" = "$AuthToken"
        "lastLoginTime" = $LoginTime
        "commands" = @(
            [PSCustomObject]@{
                "action" = "guild.get"
                "args" = [PSCustomObject]@{
                    "playerId" = "$PlayerID"
                    "guildId" = "$SquadID"
                }
                "requestId" = 17
                "time" = [int](Get-EpochTime)
                "token" = [guid]::NewGuid()
            }
        )
    }

}


function Find-Squad
{
    Param ($AuthToken, $PlayerID, $SquadName, [int]$LoginTime)

    $batch = [PSCustomObject]@{
        "authKey" = "$AuthToken"
        "lastLoginTime" = $LoginTime
        "commands" = @(
            [PSCustomObject]@{
                "action" = "guild.search.byName"
                "args" = [PSCustomObject]@{
                    "playerId" = "$PlayerID"
                    "searchTerm" = "$SquadName"
                }
                "requestId" = 0
                "time" = [int](Get-EpochTime)
                "token" = [guid]::NewGuid()
            }
        )
    }
.....
}


#[System.IO.FileInfo]$player_prefs_file = "$($PSScriptRoot)\playerprefs.dat.jaq"
[System.IO.FileInfo]$player_prefs_file = "$($PSScriptRoot)\playerprefs.dat.2tee2"
$player_pref = Get-PlayerPref $player_prefs_file

$player_id = $player_pref.prefPlayerId
$player_secret = $player_pref.prefPlayerSecret

$auth_token = Get-AuthToken $player_id $player_secret

#while ($true)
#{
#    Connect-Player $player_id $auth_token
#    Start-Sleep -Seconds (Get-Random -Minimum 156 -Maximum 298)
#}

Start-Sleep -Seconds 5
$cp = Connect-Player $player_id $auth_token
Start-Sleep -Seconds 5
# TODO!: $cp.serverTimestamp is an array?
[int]$login_time = $cp.serverTimestamp[0]

$squad_name = 'fcuk'
#$squad_name = 'thehcr'
$sid = (Find-Squad $auth_token $player_id $squad_name $login_time)._id
Start-Sleep -Seconds 5

$squad = Get-Squad $auth_token $player_id $sid $login_time
Start-Sleep -Seconds 5
Write-Host ConvertTo-Json -InputObject $squad -Depth 20

ConvertTo-Json -InputObject $squad -Depth 20 |Out-File squad.json

$sname = $squad.name

$members = $squad.members |Select-Object @{Name="title"; Expression = {$_.name}},@{Name="subtitle"; Expression = {"XP: $($_.xp) `r`n Join Date: $(ConvertFrom-EpochTime $_.joinDate)"}}

ConvertTo-Json -InputObject $members -Depth 20 |Out-File members.json

$treeData = @(
    [PSCustomObject]@{
        title = $sname
        children = $members
    }
)

ConvertTo-Json -InputObject $treeData -Depth 20 -Compress |Out-File treeData.json

#1..10000 |% {$PSItem; C:\Users\joshu\OneDrive\swc-fcuk\PoshCommander\back\Posh-Commander.ps1; Start-Sleep -Seconds (Get-Random -Minimum 156 -Maximum 298)}

