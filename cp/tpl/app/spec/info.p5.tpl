<table class="incp-formtable">
<tbody>
<tr>
  <td width="200px">ID</td>
  <td>{[=it.meta.id]}</td>
</tr>


{[? it.description]}
<tr>
  <td>Description</td>
  <td>{[=it.description]}</td>
</tr>
{[?]}

{[if (it.depends.length > 0) {]}
<tr>
  <td>Dependent AppSpec</td>
  <td id="incp-app-specset-depls">
    <table>
      <thead><tr>
        <th>ID</th>
        <th>Name</th>
        <th>Version</th>
      </tr></thead>
      <tbody>
      {[~it.depends :v]}
      <tr id="incp-app-specset-depls-id{[=v.id]}">
        <td>{[=v.id]}</td>
        <td>{[=v.name]}</td>
        <td>{[=v.version]}</td>
      </tr>
      {[~]}
      </tbody>
    </table>
  </td>
</tr>
{[}]}

{[if (it.packages.length > 0) {]}
<tr>
  <td>Dependent Packages</td>
  <td id="incp-app-specset-ipmls">
    <table>
      <thead><tr>
        <th>Name</th>
        <th>Version</th>
        <th>Dist / Arch</th>
        <th>Volume</th>
      </tr></thead>
      <tbody>
      {[~it.packages :v]}
      <tr id="incp-app-specset-ipmls-name{[=v.name]}">
        <td>{[=v.name]}</td>
        <td>{[=v.version]}</td>
        <td>{[=v.dist]} / {[=v.arch]}</td>
        <td>/usr/sysinner/{[=v.name]}/{[=v.version]}</td>
      </tr>
      {[~]}
      </tbody>
    </table>
  </td>
</tr>
{[}]}

{[if (it.vcs_repos.length > 0) {]}
<tr>
  <td>Dependent Git Repos</td>
  <td id="incp-app-specset-vcsls">
    <table>
      <thead><tr>
        <th>URL</th>
        <th>Branch</th>
        <th>Directory</th>
        <th>Update Plan</th>
      </tr></thead>
      <tbody>
      {[~it.vcs_repos :v]}
      <tr>
        <td>{[=v.url]}</td>
        <td>{[=v.branch]}</td>
        <td>/home/action/{[=v.dir]}</td>
        <td>{[=v.plan]}</td>
      </tr>
      {[~]}
      </tbody>
    </table>
  </td>
</tr>
{[}]}

{[if (it.executors.length > 0) {]}
<tr>
  <td>Script Executors</td>
  <td id="incp-app-specset-executorls">
    {[~it.executors :v]}
    <div class="incp-app-specset-gn-box">
      <div class="head">
        <span class="title">{[=v.name]}</span>
      </div>
      <div class="body">
        <table width="100%">
          <tr>
            <td width="120">ExecStart</td>
            <td><pre><code class="bash">{[=v.exec_start.trim()]}</code></pre></td>
          </tr>
          {[if (v.exec_stop.trim().length > 0) {]}
          <tr>
            <td>ExecStop</td>
            <td><pre><code class="bash">{[=v.exec_stop.trim()]}</code></pre></td>
          </tr>
          {[}]}
          <tr>
            <td>Priority</td>
            <td>{[=v.priority]}</td>
          </tr>
          <tr>
            <td>Plan</td>
            <td>
              {[if (v.plan.on_boot) {]}
                On Boot
              {[}]}
              {[if (v.plan.on_tick > 0) {]}
                On Tick {[=v.plan.on_tick]}
              {[}]}
          </tr>
        </table>
      </div>
    </div>
    {[~]}
  </td>
</tr>
{[}]}

{[if (it.service_ports.length > 0) {]}
<tr>
  <td>Service Ports</td>
  <td>
    <table>
      <thead>
        <tr>
          <th>Name (http,https, ...)</th>
          <th>Box Port</th>
        <tr>
      </thead>
      <tbody>
        {[~it.service_ports :vp]}
        <tr>
          <td>{[=vp.name]}</td>
          <td>{[=vp.box_port]}</td>
        </tr>
        {[~]}
      </tbody>
    </table>
  </td>
</tr>
{[}]}

{[if (it._roles.length > 0) {]}
<tr>
  <td>Allowed Roles</td>
  <td>
    {[~it._roles :v]}
    <span class="badge badge-primary">{[=v]}</span>
    {[~]}
  </td>
</tr>
{[}]}

<tr>
  <td>Minimum Requirements</td>
  <td>
    <table>
      <thead><tr>
        <th width="33%">CPU units (1000m = 1 core)</th>
        <th width="33%">Memory Size</th>
        <th>System Volume Size</th>
      </tr></thead>
      <tbody>
      <tr id="incp-app-specset-depls-id{[=v.id]}">
        <td>{[=it.exp_res.cpu_min]} m</td>
        <td>{[=inCp.UtilResSizeFormat(it.exp_res.mem_min)]}</td>
        <td>{[=inCp.UtilResSizeFormat(it.exp_res.vol_min, 1)]}</td>
      </tr>
      </tbody>
    </table>
  </td>
</tr>

</tbody>
</table>

