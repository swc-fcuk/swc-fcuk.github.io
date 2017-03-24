
using namespace System.Text

class Utils {
    static hidden Utils() {

    }

    # TODO!: change Get-Date with [datetime]::
    static [datetime] ConvertFromEpochTime([int] $epochTime) {
        return (Get-Date -Date "01/01/1970").AddSeconds($epochTime).ToLocalTime()
    }

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

Class SWCClient {
    static [string] InvokeSWCRequest($command) {
        $batch = [PSCustomObject]@{
            "authKey" = ""
            "pickupMessages" = $true
            "lastLoginTime" = 0
            "commands" = @(
                [PSCustomObject]@{
                    "action" = $command.Action
                    "args" = [PSCustomObject]@{
                        "locale" = "en_US"
                    }
                    "requestId" = 2
                    "time" = ([Utils]::ConvertToEpochTime([datetime]::Now))
                    "token" = [guid]::NewGuid()
                }
                #$command
            )
        }

        $body = "batch=$([System.Net.WebUtility]::UrlEncode((ConvertTo-Json $batch -Depth 3 -Compress)))"

        $response = Invoke-RestMethod -Uri https://n7-startswin-web-active.playdom.com/app/batch/json `
            -Method Post -Body $body -ErrorAction Stop

        return $response
    }
}


$prefFile = './../../playerprefs/playerprefs.dat.Dragan-2'

$c = Get-Content "$($PSScriptRoot)$($prefFile)" -Raw -Encoding Ascii

# only for this file
$playerId = $c.Substring(0x298, 36)
$playerSecret = $c.Substring(0x2d5, 32)



