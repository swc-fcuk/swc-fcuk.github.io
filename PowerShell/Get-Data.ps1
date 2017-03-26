
using namespace System
using namespace System.Text
using namespace System.Security.Cryptography

$VerbosePreference = 'Continue'
$DebugPreference = 'Continue'

class Utils {
    static hidden Utils() {

    }
    # TODO!: change Get-Date to [datetime]::
    static [datetime] ConvertFromEpochTime([int] $epochTime) {
        return (Get-Date -Date "01/01/1970").AddSeconds($epochTime).ToLocalTime()
    }
    # TODO!: change Get-Date to [datetime]::
    static [int] ConvertToEpochTime ([datetime] $dateTime) {
        return [Math]::Floor([double]::Parse((Get-Date -Date $dateTime.ToUniversalTime() -UFormat %s)))
    }

    static [string] ConvertToBase64String([string] $string) {
        $bytes = [Encoding]::UTF8.GetBytes($string)
        $base64 = [Convert]::ToBase64String($bytes)
        return $base64
    }

    #static [string] ConvertFromBytes([byte[]] $bytes, [int] $byteIndex, [int] $byteCount)
    #{
    #    return [Encoding]::ASCII.GetString($bytes, $start, $end)
    #}
}


$prefs = gc "$($PSScriptRoot)/../../playerprefs/playerprefs.dat.Dragan-2" -Raw -Encoding UTF8
$playerId = $prefs.Substring($prefs.IndexOf('prefPlayerId') + 16, 36)
$playerSecret = $prefs.Substring($prefs.IndexOf('prefPlayerSecret') + 20, 32)
$epochTime = [Math]::Floor([double]::Parse((Get-Date ([datetime]::UtcNow) -UFormat %s)))
$message = "{`"userId`":`"$($playerId)`",`"expires`":$($epochTime)}"
$hmac = [HMACSHA256]::new()
$hmac.Key = [Encoding]::UTF8.GetBytes($playerSecret)
$hash = $hmac.ComputeHash([Encoding]::UTF8.GetBytes($message))
$hex = [BitConverter]::ToString($hash) -replace '-', ''
$requestToken = [Convert]::ToBase64String(([Encoding]::UTF8.GetBytes("$($hex).$($message)")))

$body = "batch={`"authKey`":`"`",`"commands`":[{`"action`":`"auth.getAuthToken`",`"args`":{`"playerId`":`"$($playerId)`",`"requestToken`":`"$($requestToken)`"}}]}"
$r = Invoke-RestMethod -Uri https://n7-startswin-web-active.playdom.com/app/batch/json -Method Post -Body $body
$authToken = $r.data.result

####################

$requestId = 0
#$sessionId = [guid]::NewGuid()
# hash is enough, doesn't need to be ordered or PSCustomObject
$batch = @{
    authKey = "$($authToken)"
    pickupMessages = $true
    #lastLoginTime = 0
    commands = @(
        @{
            action = "player.login"
            args = @{
                playerId = "$($playerId)"
                #sessionId = "$($sessionId)"
            }
            #requestId = $requestId++
            #time = 0
            #token = "$([guid]::NewGuid())"
        }
    )
}

$body = "batch=$(ConvertTo-Json -InputObject $batch -Depth 10 -Compress)"
$r = $null
$r = Invoke-RestMethod -Uri https://n7-startswin-web-active.playdom.com/app/batch/json -Method Post -Body $body
$lastLoginTime = $r.data.messages.login.message.loginTime

# not guild.get.public
$batch = @{
    authKey = "$($authToken)"
    pickupMessages = $true
    #lastLoginTime = $lastLoginTime
    commands = @(
        @{
            action = "guild.get"
            args = @{
                playerId = "$($playerId)"
                #sessionId = "$($sessionId)"
            }
            #requestId = $requestId++
            time = [utils]::ConvertToEpochTime((Get-Date))
            #token = "$([guid]::NewGuid())"
        }
    )
}

$body = "batch=$(ConvertTo-Json -InputObject $batch -Depth 10 -Compress)"
$r = $null
$r = Invoke-RestMethod -Uri https://n7-startswin-web-active.playdom.com/app/batch/json -Method Post -Body $body
#$r.data.messages
$r.data.result |ConvertTo-Json -Depth 20 -Compress|Out-File "$($PSScriptRoot)/../data/$($r.data.result.id).json" -Encoding utf8
# with a timestamp
$r.data.result |ConvertTo-Json -Depth 20 -Compress|Out-File "$($PSScriptRoot)/../data/$($r.data.result.id)@$($r.serverTimestamp).json" -Encoding utf8

$r.data.result.members.playerId |ForEach-Object {
    $batch = @{
        authKey = "$($authToken)"
        pickupMessages = $true
        #lastLoginTime = $lastLoginTime
        commands = @(
            @{
                action = "player.neighbor.visit"
                args = @{
                    playerId = "$($playerId)"
                    neighborId = "$($PSItem)"
                    #sessionId = "$($sessionId)"
                }
                #requestId = $requestId++
                time = [utils]::ConvertToEpochTime((Get-Date))
                #token = "$([guid]::NewGuid())"
            }
        )
    }

    $body = "batch=$(ConvertTo-Json -InputObject $batch -Depth 10 -Compress)"
    $r = $null
    $r = Invoke-RestMethod -Uri https://n7-startswin-web-active.playdom.com/app/batch/json -Method Post -Body $body
    $r.data.result |ConvertTo-Json -Depth 20 -Compress|Out-File "$($PSScriptRoot)/../data/$($r.data.result.player.playerId).json" -Encoding utf8
    # with a timestamp
    $r.data.result |ConvertTo-Json -Depth 20 -Compress|Out-File "$($PSScriptRoot)/../data/$($r.data.result.player.playerId)@$($r.serverTimestamp).json" -Encoding utf8
}
