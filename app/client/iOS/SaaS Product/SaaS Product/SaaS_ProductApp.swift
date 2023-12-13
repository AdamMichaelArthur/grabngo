//
//  SaaS_ProductApp.swift
//  SaaS Product
//
//  Created by Adam Arthur on 7/13/23.
//

import SwiftUI

@main
struct SaaS_ProductApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
