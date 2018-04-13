## Databricks

### Step 1: Create Cluster
### Step 2: Create and attach Notebook (below is Scala)
### Step 3: Add and attach Library
```
azure-eventhubs-spark_2.11-2.3.1
```

### Step 4: Mount FS
https://docs.databricks.com/spark/latest/data-sources/azure/azure-storage.html
```scala
// mount Azure Blob storage container with DBFS
// https://docs.databricks.com/spark/latest/data-sources/azure/azure-storage.html#mount-azure-blob-storage-containers-with-dbfs

dbutils.fs.mount(
  source = "wasbs://{YOUR_CONTAINER_NAME}@{YOUR_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/{YOUR_DIRECTORY_NAME}",
  mountPoint = "{mountPointPath}",
  extraConfigs = Map("{confKey}" -> "{confValue}"))

// unmount
// dbutils.fs.unmount("/mnt/blob")
```

### Step 5: Setup streaming
```scala
import org.apache.spark.eventhubs.{ ConnectionStringBuilder, EventHubsConf, EventPosition }
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.sql.functions._

// To connect to an Event Hub, EntityPath is required as part of the connection string.
// Here, we assume that the connection string from the Azure portal does not have the EntityPath part.
val connectionString = ConnectionStringBuilder("{event_hub_endpoint};SharedAccessKeyName={key_name};SharedAccessKey={access_key")
  .setEventHubName("{event_hub_name}")
  .build
val eventHubsConf = EventHubsConf(connectionString)
  .setStartingPosition(EventPosition.fromEndOfStream)
   
val eventhubs = spark.readStream
  .format("eventhubs")
  .options(eventHubsConf.toMap)
  .load()

val archivedata_string = eventhubs.selectExpr("CAST(body as STRING)")

// cast binary to string
val archivedata = archivedata_string.select(col("body").alias("body"))

archivedata
  .writeStream
  .outputMode("append")
  .option("checkpointLocation", "/mnt/blob/databricks/progressdir/")
  .format("json").option("path", "/mnt/blob/databricks/data/")
  .start()

display(archivedata)
```
