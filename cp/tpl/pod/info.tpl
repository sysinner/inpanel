<div class="panel panel-default">
  <div class="panel-heading">Info</div>
  <div class="panel-body">
    <table width="100%" class="loscp-panel-table">
      <tr>
        <td width="220" class="lpt-title">ID</td>
        <td>{[=it.meta.id]}</td>
      </tr>
      <tr>
        <td class="lpt-title">Name</td>
        <td>{[=it.meta.name]}</td>
      </tr>
      <tr>
        <td class="lpt-title">Created / Updated</td>
        <td>{[=l4i.MetaTimeParseFormat(it.meta.created, "Y-m-d")]} / {[=l4i.MetaTimeParseFormat(it.meta.updated, "Y-m-d H:i:s")]}</td>
      </tr>
    </table>
  </div>
</div>

<div class="panel panel-default">
  <div class="panel-heading">Operating</div>
  <div class="panel-body">
    <table width="100%" class="loscp-panel-table">
      <tr>
        <td width="220" class="lpt-title">Action</td>
        <td>{[=it.operate.action]}</td>
      </tr>
      <tr>
        <td class="lpt-title">Cluster (Zone / Cell)</td>
        <td>{[=it.spec.zone]} / {[=it.spec.cell]}</td>
      </tr>
      {[?it.operate.node]}
      <tr>
        <td class="lpt-title">Host</td>
        <td>{[=it.operate.node]}</td>
      </tr>
      {[?]}
      {[if (it.operate.ports && it.operate.ports.length > 0) {]}
      <tr>
        <td class="lpt-title">Service Ports</td>
        <td>
		  <table class="table table-hover">
		  <thead><tr>
		  <th>Name</th>
		  <th>Host Port</th>
		  <th>Box Port</th>
		  <th></th>
		  </thead></tr>
		  <tbody>
          {[~it.operate.ports :opv]}
	      <tr>
          <td>{[=opv.name]}</td>
		  <td>{[=opv.host_port]}</td>
		  <td>{[=opv.box_port]}</td>
		  <td>TCP</td>
		  </tr>
		  {[~]}
		  </tbody>
		  </table>
		</td>
      </tr>
      {[}]}
    </table>
  </div>
</div>

<div class="panel panel-default">
  <div class="panel-heading">Spec</div>
  <div class="panel-body">
    <table width="100%" class="loscp-panel-table">
      <tr>
        <td width="220" class="lpt-title">ID</td>
        <td>{[=it.spec.ref.id]}</td>
      </tr>
      <tr>
        <td class="lpt-title">Name</td>
        <td>{[=it.spec.ref.name]}</td>
      </tr>
      <tr>
        <td class="lpt-title">Version</td>
        <td>{[=it.spec.ref.version]}</td>
      </tr>
      {[ if (it.spec.labels && it.spec.labels.length > 0) { ]}
      <tr>
        <td class="lpt-title">Lables (Name / Value)</td>
        <td>
          <table width="100%"><tbody>
            {[~it.spec.labels :v]}
            <tr>
              <td width="50%">{[=v.name]}</td>
              <td>{[=v.value]}</td>
            </tr>
            {[~]}
          </tbody></table>
        </td>
      </tr>
      {[ } ]}

      {[ if (it.spec.volumes && it.spec.volumes.length > 0) { ]}
      <tr>
        <td class="lpt-title">Volumes (Name / Size)</td>
        <td>
          <table width="100%"><tbody>
            {[~it.spec.volumes :v]}
            <tr>
              <td width="50%">{[=v.name]}</td>
              <td>{[=losCp.UtilResSizeFormat(v.size_limit)]}</td>
            </tr>
            {[~]}
          </tbody></table>
        </td>
      </tr>
      {[ } ]}

      {[ if (it.spec.boxes && it.spec.boxes.length > 0) { ]}
      {[~it.spec.boxes :box]}
      <tr>
        <td class="lpt-title">Box ({[=box.name]})</td>
        <td>
          <table width="100%"><tbody>
            <tr>
              <td>Image Name</td>
              <td>{[=box.image.ref.name]}</td>
            </tr>
            <tr>
              <td>Image Driver</td>
              <td>{[=box.image.driver]}</td>
            </tr>
            <tr>
              <td>Image Options</td>
              <td>
                <table width="100%">
                {[~box.image.options :lv]}
                <tr>
                  <td>{[=lv.name]}</td>
                  <td>{[=lv.value]}</td>
                </tr>
                {[~]}
                </table>
              </td>
            </tr>
            <tr>
              <td>Image OS / Arch</td>
              <td>{[=box.image.os_dist]} / {[=box.image.arch]}</td>
            </tr>
            <tr>
              <td>CPU</td>
              <td>{[=box.resources.cpu_limit]}m</td>
            </tr>
            <tr>
              <td>Memory</td>
              <td>{[=losCp.UtilResSizeFormat(box.resources.mem_limit)]}</td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      {[~]}
      {[ } ]}
    </table>
  </div>
</div>

{[?it.apps]}
<div class="panel panel-default">
  <div class="panel-heading">Applications</div>
  <div class="panel-body">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Spec</th>
          <th>Packages</th>
          <th>Executors</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        {[~it.apps :v]}
        <tr>
          <td>{[=v.meta.name]}</td>
          <td>{[=v.spec.meta.name]}</td>
          <td>{[if (v.spec.packages) { ]}{[=v.spec.packages.length]}{[ } ]}</td>
          <td>{[if (v.spec.executors) { ]}{[=v.spec.executors.length]}{[ } ]}</td>
          <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
        </tr>
        {[~]}
      </tbody>
    </table>
  </div>
</div>
{[?]}


