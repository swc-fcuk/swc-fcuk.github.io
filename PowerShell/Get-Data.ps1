#Get-Data.ps1


#Requires -Version 5


using namespace System
using namespace System.IO
using namespace System.Management.Automation.PSCustomObject
#using namespace System.Net.Http
using namespace System.Security.Cryptography
using namespace System.Text


$VerbosePreference = 'Continue'

$DebugPreference = 'Continue'


Class Utils 
{
    static hidden Utils()
    {

    }

    static [datetime] ConvertFromEpochTime([int] $epochTime)
    {
        return (Get-Date -Date "01/01/1970").AddSeconds($epochTime).ToLocalTime()
    }
    
    
    static [int] ConvertToEpochTime ([datetime] $dateTime)
    {
        # The Unix timestamp should be rounded down? SWC disagrees? Clock sync?
        #return [Math]::Floor([double]::Parse((Get-Date -Date $dateTime.ToUniversalTime() -UFormat %s)))
        return [Math]::Ceiling([double]::Parse((Get-Date -Date $dateTime.ToUniversalTime() -UFormat %s)))
    }
    
    
    static [string] ConvertToBase64String([string] $string)
    {
        $bytes = [Encoding]::UTF8.GetBytes($string)
        $base64 = [Convert]::ToBase64String($bytes)
        return $base64
    }

    static [string] GetRequestToken([PlayerPrefs] $prefs)
    {
        $epochTime = [Math]::Floor([double]::Parse((Get-Date ([datetime]::UtcNow) -UFormat %s)))
    
        $message = "{`"userId`":`"$($prefs.playerId)`",`"expires`":$($epochTime)}"
    
        $hmac = [HMACSHA256]::new()
        $hmac.Key = [Encoding]::UTF8.GetBytes($prefs.playerSecret)
        $hash = $hmac.ComputeHash([Encoding]::UTF8.GetBytes($message))
    
        $hex = [BitConverter]::ToString($hash) -replace '-', ''  
        return [Utils]::ConvertToBase64String("$($hex).$($message)")
    }
}


Class PlayerPrefs
{
    [guid] $PlayerId
    # TODO: 'hexadecimal'(32 bytes) type?
    [string] $PlayerSecret

    PlayerPrefs([FileInfo] $file)
    {
        $prefs = Get-Content -Path $file -Raw -Encoding UTF8
        
        $this.PlayerId = $prefs.Substring($prefs.IndexOf('prefPlayerId') + 16, 36)
        $this.PlayerSecret = $prefs.Substring($prefs.IndexOf('prefPlayerSecret') + 20, 32)
    }

    PlayerPrefs([guid] $id, [string] $secret)
    {
        $this.PlayerId = $id
        $this.PlayerSecret = $secret
    }
}


Class SwcAction
{

}


Class SwcClient
{
    # const in posh classes?
    static hidden [uri] $Uri = 'https://n7-startswin-web-active.playdom.com/app/batch/json'
    static hidden [string] $Method = 'Post'

    static hidden SwcClient()
    {
        
    }

    static [PSCustomObject] InvokeSwcRequest([hashtable] $batch)
    {
        $body = "batch=$(ConvertTo-Json -InputObject $batch -Depth 10 -Compress)"
        $r = $null
        $retries = 0
        try
        {
            $r = Invoke-RestMethod -Uri https://n7-startswin-web-active.playdom.com/app/batch/json -Method Post -Body $body -TimeoutSec 20
        }
        catch #[System.Net.WebException]
        {
            $e = $Error[0]
            Write-Host "$e ...retying..."
            Start-Sleep -Seconds 5
            # TODO: add some limit
            $retries++
            [SwcClient]::InvokeSwcRequest($batch)

        }

        if ($r.data.status -ne 0)
        {
            Write-Host "Status code: $($r.data.status)" -ForegroundColor Red
            Write-Host " ...retying..."
            Start-Sleep -Seconds 5
            # TODO: add some limit
            $retries++
            [SwcClient]::InvokeSwcRequest($batch)
        }
        else
        {
            
        }
        return $r
    }

}

$f = "$($PSScriptRoot)/../../playerprefs/playerprefs.dat.Dragan-2"

$p = [PlayerPrefs]::new($f)

$rt = [utils]::GetRequestToken($p)

#Get AuthToken
$b = @{
    authKey = ""
    commands = @(
        @{
            action = "auth.getAuthToken"
            args = @{
                playerId = "$($p.PlayerId)"
                requestToken = "$($rt)"
            }
        }
    )
}

$r = [SwcClient]::InvokeSwcRequest($b)
$atoken = $r.data.result

# Log In
$b = @{
    authKey = "$($atoken)"
    commands = @(
        @{
            action = "player.login"
            args = @{
                playerId = "$($p.PlayerId)"
            }
        }
    )
}

$r = [SwcClient]::InvokeSwcRequest($b)
$loginTime = $r.data.messages.login.message.loginTime
Write-Host "[LOGIN]: $([utils]::ConvertFromEpochTime($loginTime))"

## not guild.get.public
$b = @{
    authKey = "$($atoken)"
    #pickupMessages = $true
    #lastLoginTime = 0
    commands = @(
        @{
            action = "guild.get"
            args = @{
                playerId = "$($p.PlayerId)"
            }
            #requestId = $requestId++
            time = [utils]::ConvertToEpochTime((Get-Date))
            #time = 0
            #token = "$([guid]::NewGuid())"
        }
    )
}

$r = [SwcClient]::InvokeSwcRequest($b)
$r.data.result.id

$r.data.result |ConvertTo-Json -Depth 20 -Compress|Out-File "$($PSScriptRoot)/../data/$($r.data.result.id).json" -Encoding utf8
# with a timestamp
$r.data.result |ConvertTo-Json -Depth 20 -Compress|Out-File "$($PSScriptRoot)/../data/$($r.data.result.id)@$($r.serverTimestamp).json" -Encoding utf8


$r.data.result.members.playerId |ForEach-Object {
    $b = @{
        authKey = "$($atoken)"
        commands = @(
            @{
                action = "player.neighbor.visit"
                args = @{
                    playerId = "$($p.PlayerId)"
                    neighborId = "$($PSItem)"
                }
                time = [utils]::ConvertToEpochTime((Get-Date))
            }
        )
    }

    $r = [SwcClient]::InvokeSwcRequest($b)
    $r.data.result.player.name

    $r.data.result |ConvertTo-Json -Depth 20 -Compress|Out-File "$($PSScriptRoot)/../data/$($r.data.result.player.playerId).json" -Encoding utf8
    # with a timestamp
    $r.data.result |ConvertTo-Json -Depth 20 -Compress|Out-File "$($PSScriptRoot)/../data/$($r.data.result.player.playerId)@$($r.serverTimestamp).json" -Encoding utf8
}


