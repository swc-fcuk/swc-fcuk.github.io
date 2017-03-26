
using namespace System.Text

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
$hmac = [System.Security.Cryptography.HMACSHA256]::new()
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($playerSecret)
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($message))
$hex = [System.BitConverter]::ToString($hash) -replace '-', ''
$requestToken = [System.Convert]::ToBase64String(([System.Text.Encoding]::UTF8.GetBytes("$($hex).$($message)")))

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
$r.data.result |ConvertTo-Json |Out-File "$($PSScriptRoot)/../data/$($r.data.result.id)@$($r.serverTimestamp).json" -Encoding utf8
