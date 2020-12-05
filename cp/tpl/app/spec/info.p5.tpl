<table class="incp-formtable">
  <tbody>
    <tr>
      <td width="260px">ID</td>
      <td>{[=it.meta.id]}</td>
    </tr>


    {[? it.meta.name]}
    <tr>
      <td>Name</td>
      <td>{[=it.meta.name]}</td>
    </tr>
    {[?]}

    {[? it.description]}
    <tr>
      <td>Description</td>
      <td>{[=it.description]}</td>
    </tr>
    {[?]}


    {[if (it.packages.length > 0) {]}
    <tr>
      <td>Import Package</td>
      <td id="incp-app-specset-ipmls">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Version</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {[~it.packages :v]}
            <tr id="incp-app-specset-ipmls-name{[=v.name]}">
              <td>{[=v.name]}</td>
              <td>{[=v.version]}</td>
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
      <td>Import Git Repo</td>
      <td id="incp-app-specset-vcsls">
        <table>
          <thead>
            <tr>
              <th>Repo URL</th>
              <th>Branch</th>
              <th>Clone Directory</th>
            </tr>
          </thead>
          <tbody>
            {[~it.vcs_repos :v]}
            <tr>
              <td>{[=v.url]}</td>
              <td>{[=v.branch]}</td>
              <td>/home/action/{[=v.dir]}</td>
            </tr>
            {[~]}
          </tbody>
        </table>
      </td>
    </tr>
    {[}]}


    {[if (it.depends.length > 0) {]}
    <tr>
      <td>Import AppSpec</td>
      <td id="incp-app-specset-depls">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Version</th>
            </tr>
          </thead>
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

    {[if (it.dep_remotes && it.dep_remotes.length > 0) {]}
    <tr>
      <td>Remotely Import AppSpec</td>
      <td id="incp-app-specset-depremotes">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Version</th>
              <th>Configs</th>
            </tr>
          </thead>
          <tbody>
            {[~it.dep_remotes :v]}
            <tr id="incp-app-specset-depremotes-id{[=v.id]}">
              <td>{[=v.id]}</td>
              <td>{[=v.name]}</td>
              <td>{[=v.version]}</td>
              <td>{[? v.configs]}{[=v.configs.join(", ")]}{[?]}</td>
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
                <td>
                  <pre><code class="bash">{[=v.exec_start.trim()]}</code></pre>
                </td>
              </tr>
              {[? v.exec_stop && v.exec_stop.trim().length > 0]}
              <tr>
                <td>ExecStop</td>
                <td>
                  <pre><code class="bash">{[=v.exec_stop.trim()]}</code></pre>
                </td>
              </tr>
              {[?]}
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
              <th width="33%">Port</th>
              <th width="33%">Name (http,https, ...)</th>
              <th></th>
            <tr>
          </thead>
          <tbody>
            {[~it.service_ports :vp]}
            <tr>
              <td>{[=vp.box_port]}</td>
              <td>{[=vp.name]}</td>
              <td></td>
            </tr>
            {[~]}
          </tbody>
        </table>
      </td>
    </tr>
    {[}]}


    <tr>
      <td>Minimum Requirements</td>
      <td>
        <table>
          <thead>
            <tr>
              <th width="33%">CPU</th>
              <th width="33%">Memory</th>
              <th>System Volume</th>
            </tr>
          </thead>
          <tbody>
            <tr id="incp-app-specset-depls-id{[=v.id]}">
              <td>{[=it.exp_res._cpu_min]} cores</td>
              <td>{[=it.exp_res.mem_min]} MB</td>
              <td>{[=it.exp_res.vol_min]} GB</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>

    <tr>
      <td>Deploy Requirements</td>
      <td>
        <table>
          <thead>
            <tr>
              <th width="33%">Number of Replicas</th>
              <th width="33%">State</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Min/Max: {[=it.exp_deploy.rep_min]} / {[=it.exp_deploy.rep_max]}</td>
              <td>{[=it.exp_deploy._sys_state]}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>


    {[? it.exp_deploy._failover_enable]}
    <tr>
      <td>High Availability</td>
      <td>
        <table width="100%">
          <thead>
            <tr>
              <th width="33%">Delay time before failover</th>
              <th width="33%">Max number of fails in recovering</th>
              <th>Max rate of fails in recovering</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{[=it.exp_deploy.failover_time]} seconds</td>
              <td>{[? it.exp_deploy.failover_num_max]}{[=it.exp_deploy.failover_num_max]}{[??]}--{[?]}</td>
              <td>{[? it.exp_deploy.failover_rate_max]}{[=it.exp_deploy.failover_rate_max]} %{[??]}--{[?]}</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    {[?]}


    {[? it._runtime_images && it._runtime_images.length > 0]}
    <tr>
      <td>Allowed Runtime Images</td>
      <td>
        {[~it._runtime_images :v]}
        <span class="badge badge-primary">{[=v]}</span>
        {[~]}
      </td>
    </tr>
    {[?]}


    {[? it._roles && it._roles.length > 0]}
    <tr>
      <td>Allowed Roles</td>
      <td>
        {[~it._roles :v]}
        <span class="badge badge-primary">{[=v]}</span>
        {[~]}
      </td>
    </tr>
    {[?]}

    {[? it._type_tags && it._type_tags.length > 0]}
    <tr>
      <td>Type Tags</td>
      <td>
        {[~it._type_tags :v]}
        <span class="badge badge-primary">{[=v]}</span>
        {[~]}
      </td>
    </tr>
    {[?]}


    {[? it.comment]}
    <tr>
      <td>Comment</td>
      <td>
        {[=it.comment]}
      </td>
    </tr>
    {[?]}


  </tbody>
</table>