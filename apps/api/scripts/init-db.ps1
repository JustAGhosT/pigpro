param(
  [string]$PgHost = $env:PGHOST,
  [string]$PgPort = $env:PGPORT,
  [string]$PgUser = $env:PGUSER,
  [string]$PgPassword = $env:PGPASSWORD,
  [string]$PgDatabase = $env:PGDATABASE
)

$ErrorActionPreference = "Stop"

if (-not $PgHost) { $PgHost = "localhost" }
if (-not $PgPort) { $PgPort = "5432" }
if (-not $PgUser) { $PgUser = "user" }
if (-not $PgPassword) { $PgPassword = "password" }
if (-not $PgDatabase) { $PgDatabase = "farmdb" }

Write-Host ("Initializing Postgres database {0} on {1}:{2} as {3}" -f $PgDatabase, $PgHost, $PgPort, $PgUser)

$env:PGPASSWORD = $PgPassword

function Invoke-Psql($ArgsLine) {
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = "psql"
  $psi.Arguments = "-h $PgHost -p $PgPort -U $PgUser -w $ArgsLine"
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.UseShellExecute = $false
  $proc = [System.Diagnostics.Process]::Start($psi)
  $out = $proc.StandardOutput.ReadToEnd()
  $err = $proc.StandardError.ReadToEnd()
  $proc.WaitForExit()
  if ($proc.ExitCode -ne 0) { throw "psql failed: $err" }
  if ($out) { Write-Host $out }
}

# Create database if not exists
try {
  Invoke-Psql "-d postgres -c \"CREATE DATABASE $PgDatabase WITH OWNER $PgUser TEMPLATE template1\""
}
catch {
  Write-Host ("Database {0} may already exist or creation failed: {1}" -f $PgDatabase, $_.Exception.Message)
}

# Create schema table if not exists
$schemaSql = @"
CREATE TABLE IF NOT EXISTS listings (
  id text PRIMARY KEY,
  title text NOT NULL,
  price numeric NOT NULL,
  currency text,
  image text,
  location text,
  rating numeric,
  reviews integer,
  category text,
  breed text,
  age text,
  gender text,
  is_verified boolean,
  description text,
  created_at timestamptz,
  promoted boolean DEFAULT false,
  likes integer DEFAULT 0
);
"@

Invoke-Psql "-d $PgDatabase -c \"$schemaSql\""

Write-Host "Database initialized."


